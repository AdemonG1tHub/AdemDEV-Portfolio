import "./hub.css";
import { $, $$, DISCORD, SITE, coverHtml, entries, escapeHtml, hydrateIcons, linkButtons, mount, statusTag, tablist, tagHtml, type Entry } from "./shared";
import { isVideoMedia, resolveMediaPath } from "@/lib/media";
import { iconHtml } from "@/lib/icon";

/* ------------------------------ data ------------------------------------ */
/**
 * Tabs/sections. A project's tab comes from its `category` in site.config.ts
 * ("commissioned" | "projects" | "free"); with none set it falls under "Projects".
 * To add another tab, extend `ProjectCategory` in src/types/site.ts and add it here.
 */
const CATS = [
  { id: "commissioned", label: "Commissioned", blurb: "Built for servers and clients" },
  { id: "projects", label: "Projects", blurb: "My own products and platforms" },
  { id: "free", label: "Free-to-use", blurb: "Libraries and resources anyone can use" },
] as const;
const catOf = (e: Entry): (typeof CATS)[number]["id"] => e.p.category ?? "projects";

const TIPS = [
  "Every pixel here was placed by hand.",
  "Press / to jump straight to search.",
  "Click any card to flip through its screenshots.",
  "Hover the profile card. It tilts.",
  "Use ← → inside a project to browse its gallery.",
];
const LOAD_MSGS = ["Loading Projects...", "Generating terrain...", "Optimizing Site...", "Portfolio loaded."];

/* ------------------------------ markup ---------------------------------- */
const cover = (e: Entry) => (e.p.cover ? `<img src="${escapeHtml(e.p.cover)}" alt="" loading="lazy">` : coverHtml(e));
const card = (e: Entry, i: number) => `
  <article class="card reveal" tabindex="0" role="button" data-slug="${e.slug}" data-cat="${catOf(e)}" style="--i:${i % 6};--accent:${escapeHtml(e.p.color ?? "#5fbf4b")}"
    data-search="${escapeHtml(`${e.p.title} ${e.p.desc ?? ""} ${(e.p.tags ?? []).join(" ")}`.toLowerCase())}">
    <div class="cover">${cover(e)}<span class="badge">${statusTag(e.status)}</span>${e.p.gallery?.length ? `<span class="count">${e.p.gallery.length} shots</span>` : ""}<span class="glare"></span></div>
    <div class="body">
      <h3>${e.p.icon ? iconHtml(e.p.icon, "ico") : ""}${escapeHtml(e.p.title)}</h3>
      <p>${escapeHtml(e.p.desc ?? "")}</p>
    </div>
    <footer><span>${escapeHtml((e.p.tags ?? []).slice(0, 2).join(" · "))}</span><span class="go" aria-hidden="true">›</span></footer>
  </article>`;

const sections = CATS.map((c) => {
  const items = entries.filter((e) => catOf(e) === c.id);
  if (!items.length) return "";
  return `<section class="group" id="g-${c.id}" data-group="${c.id}">
    <div class="group-head reveal"><div><h2>${c.label}</h2><span>${c.blurb}</span></div><span class="n">${items.length}</span></div>
    <div class="grid">${items.map(card).join("")}</div></section>`;
}).join("");

const filters = [{ id: "all", label: "All" }, ...CATS.filter((c) => entries.some((e) => catOf(e) === c.id))];
const backdropTiles = [...entries, ...entries, ...entries].filter((e) => e.p.cover).slice(0, 30).map((e) => `<i style="background-image:url('${escapeHtml(e.p.cover!)}')"></i>`).join("");
const active = entries.filter((e) => e.status !== "archived").length;

/** Small, safe Discord-flavoured markdown renderer (input is escaped first, so no raw HTML gets through). */
function mdToHtml(src: string): string {
  const inline = (s: string): string =>
    escapeHtml(s)
      .replace(/:black_reply:/g, "↪")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/(?<![">=])(https?:\/\/[^\s<)*]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\|\|(.+?)\|\|/g, '<span class="spoiler" tabindex="0">$1</span>')
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<u>$1</u>")
      .replace(/~~(.+?)~~/g, "<s>$1</s>")
      .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/(^|[^_\w])_(?!\s)(.+?)_(?![_\w])/g, "$1<em>$2</em>");
  const out: string[] = [];
  let list: string | null = null;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const lines = src.replace(/\r/g, "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("```")) {
      closeList();
      const code: string[] = [];
      for (i++; i < lines.length && !(lines[i] ?? "").startsWith("```"); i++) code.push(lines[i] ?? "");
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^\s*[-*]\s+(.*)/))) { if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inline(m[1]!)}</li>`); continue; }
    if ((m = line.match(/^\s*\d+\.\s+(.*)/))) { if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inline(m[1]!)}</li>`); continue; }
    closeList();
    if ((m = line.match(/^(#{1,3})\s+(.*)/))) out.push(`<h4 class="h${m[1]!.length}">${inline(m[2]!)}</h4>`);
    else if ((m = line.match(/^>\s?(.*)/))) out.push(`<blockquote>${inline(m[1]!)}</blockquote>`);
    else if (line.trim() === "") out.push("<br>");
    else out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return out.join("");
}

/** Discord profile shown on the hero card. These values are a snapshot so the first paint is already
 *  right; `loadDiscordProfile` refreshes them from the live profile when it can. */
const CDN = "https://cdn.discordapp.com";
const DEFAULT_PROFILE = {
  username: SITE.discord ?? "",
  avatar: SITE.discordUserId ? `${CDN}/avatars/${SITE.discordUserId}/4632100af80430c350c236bc77cf850c.png?size=256` : "/A.png",
  decoration: `${CDN}/avatar-decoration-presets/a_8552f9857793aed0cf816f370e2df3be.png?size=240&passthrough=true`,
  bannerColor: "#001a09",
  banner: SITE.discordUserId ? `${CDN}/banners/${SITE.discordUserId}/23391e014cefb56ac9d8c2f9022e7397.png?size=600` : "",
  clanTag: "SKY",
  clanBadge: `${CDN}/clan-badges/1529148687203438803/da7ca447cb8908ebfcbd37529c993743.png?size=32`,
};
const years = SITE.stats[0]?.num.match(/^(\d+)/)?.[1] ?? "";
const STAT_ICONS = ["⌛", "📦", "👑", "⚡"];
/** Two-letter item glyph + a stable colour per skill, for the toolbelt slots. */
const skillGlyph = (s: string) => {
  const w = s.split(/[\s./-]+/).filter(Boolean);
  const caps = s.match(/[A-Z]/g) ?? [];
  return (caps.length >= 2 ? caps.slice(0, 2).join("") : w.length > 1 ? w[0]![0]! + w[1]![0]! : s.slice(0, 2)).toUpperCase();
};
const skillColor = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h} 55% 42%)`;
};

const app = mount(
  `<div class="backdrop" aria-hidden="true"><div class="tiles">${backdropTiles}</div></div>
  <header class="topbar">
    <div class="tb-inner">
      <a class="tb-brand" href="#top" aria-label="${escapeHtml(SITE.name)} home"><span class="tb-logo" aria-hidden="true">A</span><b>${escapeHtml(SITE.name.slice(0, 4))}<i>${escapeHtml(SITE.name.slice(4))}</i></b></a>
      <nav class="tb-nav" id="tb-nav" aria-label="Main">
        <ul>
          <li><a class="tb-link" href="#top" data-sec="top"><span class="tb-ico" aria-hidden="true">🏠</span>Home</a></li>
          <li><a class="tb-link" href="#work" data-sec="work"><span class="tb-ico" aria-hidden="true">🧰</span>Work</a></li>
          <li><a class="tb-link" href="#about" data-sec="about"><span class="tb-ico" aria-hidden="true">📜</span>About</a></li>
          <li><a class="tb-link" href="#contact" data-sec="contact"><span class="tb-ico" aria-hidden="true">✉️</span>Contact</a></li>
          <li><a class="tb-link tb-external" href="${escapeHtml(DISCORD)}" target="_blank" rel="noopener noreferrer"><span class="tb-ico" aria-hidden="true">💬</span>Discord<svg class="tb-ext" viewBox="0 0 8 8" aria-hidden="true"><path fill="currentColor" d="M3 1h4v4H6V3.4L2.7 6.7 1.3 5.3 4.6 2H3z"/></svg><span class="visually-hidden"> (opens in a new tab)</span></a></li>
        </ul>
      </nav>
      <button class="tb-menu" type="button" aria-expanded="false" aria-controls="tb-nav" aria-label="Menu"><i></i><i></i><i></i></button>
    </div>
    <div class="scroll-bar"><i></i></div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-copy">
        <h1 class="glitch" data-text="LOADING PROJECTS">LOADING PROJECTS</h1>
        <p class="status"><span class="spin"></span><span id="load-msg">${LOAD_MSGS[0]}</span></p>
        <button class="bar" id="bar" aria-label="Replay loading animation"><i></i></button>
        <p class="tip" id="tip"><b>Tip:</b> <span>${TIPS[0]}</span> <button id="tip-next" aria-label="Next tip">↻</button></p>
        <div class="row">
          <a class="ore-button" data-variant="hero" data-color="gold" href="#work">See featured work</a>
          <a class="ore-button" data-color="blue" href="${escapeHtml(DISCORD)}" target="_blank" rel="noopener noreferrer">Discord</a>
          <a class="ore-button" data-color="neutral" href="${escapeHtml(SITE.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      <aside class="profile tilt" id="profile" aria-label="${escapeHtml(SITE.name)} on Discord">
        <div class="pf-banner" id="pf-banner" style="--banner:${escapeHtml(DEFAULT_PROFILE.bannerColor)};${DEFAULT_PROFILE.banner ? `--banner-img:url('${escapeHtml(DEFAULT_PROFILE.banner)}')` : ""}"><span class="glare"></span></div>
        <div class="pf-body">
          <div class="pf-av">
            <img class="pf-img" id="pf-av" src="${escapeHtml(DEFAULT_PROFILE.avatar)}" alt="" width="104" height="104">
            <img class="pf-deco" id="pf-deco" src="${escapeHtml(DEFAULT_PROFILE.decoration)}" alt="" ${DEFAULT_PROFILE.decoration ? "" : "hidden"}>
          </div>
          <div class="pf-chips"><span class="pf-clan" id="pf-clan" ${DEFAULT_PROFILE.clanTag ? "" : "hidden"}><img id="pf-clan-badge" src="${escapeHtml(DEFAULT_PROFILE.clanBadge)}" alt="">${escapeHtml(DEFAULT_PROFILE.clanTag)}</span></div>
          <h3 class="pf-name">${escapeHtml(SITE.name)}</h3>
          <button type="button" class="pf-handle" id="pf-handle" title="Copy Discord username">@<span id="pf-user">${escapeHtml(DEFAULT_PROFILE.username)}</span><small>copy</small></button>
          <p class="pf-tagline" id="pf-tagline" ${SITE.discordBio ? "hidden" : ""}>${escapeHtml(SITE.tagline)}</p>
          <div class="pf-bio md" id="pf-bio" ${SITE.discordBio ? "" : "hidden"}>${SITE.discordBio ? mdToHtml(SITE.discordBio) : ""}</div>
          ${SITE.discordUserId ? `<a class="ore-button pf-btn" data-color="blue" href="https://discord.com/users/${escapeHtml(SITE.discordUserId)}" target="_blank" rel="noopener noreferrer">Open on Discord</a>` : ""}
        </div>
      </aside>
    </section>

    <div class="anchor" id="work"></div>
    <div class="toolbar">
      <div class="ore-textfield">
        <span class="ore-textfield-control"><input class="ore-textfield-input" id="q" type="text" placeholder="Search projects…" autocomplete="off" aria-label="Search projects"></span>
      </div>
      <div class="tabs" role="tablist" id="filters" aria-label="Category">
        ${filters.map((f, i) => `<button class="ore-tab-button" role="tab" data-tab="${f.id}" aria-selected="${i === 0}">${f.label}</button>`).join("")}
      </div>
    </div>
    ${sections}
    <p class="empty" id="empty" hidden>No projects match that search. Try a different tag.</p>

    <section class="abt" id="about">
      <div class="group-head reveal"><div><h2>About</h2><span>Who makes these things</span></div></div>
      <div class="abt-grid">
        <article class="abt-card idcard reveal">
          <div class="id-top">
            <div class="id-av"><img src="/A.png" alt="">${years ? `<span class="lvl">${years}+ YRS</span>` : ""}</div>
            <div><h3>${escapeHtml(SITE.name)}</h3><span class="sub">${escapeHtml(SITE.tagline)}</span>
              <div class="chips">${tagHtml("Creator", "primary")}${tagHtml(`${entries.length} projects`, "informative")}</div></div>
          </div>
          <p class="lead">${escapeHtml(SITE.subtitle)}</p>
          <div class="stats">${SITE.stats.map((s, i) => `<div class="stat"><i>${STAT_ICONS[i % STAT_ICONS.length]}</i><b>${escapeHtml(s.num)}</b><span>${escapeHtml(s.label)}</span></div>`).join("")}</div>
        </article>
        <article class="abt-card svc-panel reveal" id="svc">
          <div class="svc-list" role="tablist" aria-orientation="vertical" aria-label="Services">
            ${SITE.services.map((s, i) => `<button type="button" class="svc-tab" role="tab" data-i="${i}" aria-selected="${i === 0}"><span class="e">${escapeHtml(s.icon)}</span>${escapeHtml(s.name)}</button>`).join("")}
          </div>
          <div class="svc-detail" role="tabpanel" id="svc-detail" aria-live="polite"></div>
        </article>
      </div>

      <article class="abt-card belt reveal">
        <h3>Toolbelt</h3>
        <div class="belt-name" id="belt-name" aria-live="polite"></div>
        <div class="hotbar" id="hotbar" role="listbox" aria-label="Skills">
          ${Array.from({ length: 9 }, (_, i) => {
            const s = SITE.skills[i];
            return s
              ? `<button type="button" class="slot" role="option" data-name="${escapeHtml(s)}" aria-selected="${i === 0}"><kbd>${i + 1}</kbd><span class="item" style="background:${skillColor(s)}">${escapeHtml(skillGlyph(s))}</span></button>`
              : `<span class="slot empty"><kbd>${i + 1}</kbd></span>`;
          }).join("")}
        </div>
      </article>

      <article class="cta2 reveal" id="contact">
        <div><h2>Got something in mind?</h2><p>Tell me what you want built: a Bedrock add-on, a Discord bot, or tooling for your server.</p></div>
        <div class="contact-list">
          <a class="contact" style="--c:#ffc431" href="mailto:${escapeHtml(SITE.email)}"><span class="ci">✉</span><span><strong>Email</strong><small>${escapeHtml(SITE.email)}</small></span><span class="arrow">›</span></a>
          <a class="contact" style="--c:#4a7bf0" href="${escapeHtml(DISCORD)}" target="_blank" rel="noopener noreferrer"><span class="ci">💬</span><span><strong>Discord</strong><small>Join the server</small></span><span class="arrow">›</span></a>
          <a class="contact" style="--c:#b8b9bd" href="${escapeHtml(SITE.github)}" target="_blank" rel="noopener noreferrer"><span class="ci">⌥</span><span><strong>GitHub</strong><small>${escapeHtml((SITE.github ?? "").replace(/^https?:\/\//, ""))}</small></span><span class="arrow">›</span></a>
        </div>
      </article>
    </section>
  </main>

  <dialog class="pm" id="pm" aria-labelledby="pm-title">
    <div class="pm-inner">
      <section class="pm-view">
        <div class="frame">
          <div class="frame-top"><span class="plate" id="pm-plate"></span><span class="spec"><b>FIG</b> <span id="pm-fig">01</span></span><span class="spec"><b>RES</b> <span id="pm-dim">—</span></span><span class="counter" id="pm-counter"></span></div>
          <div class="matte" id="pm-matte"><i class="ruler h"></i><i class="ruler v"></i><i class="cross"></i><div class="shot" id="pm-shot"></div>
            <button type="button" class="nav prev ore-icon-button" data-ore-icon="chevron-left" aria-label="Previous screenshot"></button>
            <button type="button" class="nav next ore-icon-button" data-ore-icon="chevron-right" aria-label="Next screenshot"></button>
          </div>
          <div class="frame-cap"><span id="pm-cap"></span><span class="spec"><b>TYPE</b> <span id="pm-type">—</span></span></div>
        </div>
        <div class="pm-thumbs" id="pm-thumbs"></div>
      </section>
      <aside class="pm-side">
        <button type="button" class="pm-close ore-icon-button" data-ore-icon="cross" id="pm-close" aria-label="Close"></button>
        <div class="pm-info" id="pm-info"></div>
      </aside>
    </div>
  </dialog>
  <div class="toast" id="toast" role="status"></div>`,
  "v-hub",
);

/* ---------------------------- discord profile ---------------------------- */
interface DiscordUser {
  username: string; avatar: string | null; banner: string | null; banner_color?: string | null; accent_color?: number | null;
  avatar_decoration_data?: { asset: string } | null;
  primary_guild?: { identity_guild_id: string; tag: string; badge: string } | null;
  bio?: string | null;
  theme_colors?: [number, number] | null;
}
const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;
/** Applies Discord's profile-theme gradient (primary → accent) to the card. */
function paintTheme(colors: [string, string] | null | undefined): void {
  const card = $("#profile", app);
  if (!card) return;
  if (colors) { card.style.setProperty("--pf-a", colors[0]); card.style.setProperty("--pf-b", colors[1]); card.classList.add("themed"); }
}
const themeOf = (u: DiscordUser): [string, string] | null => (u.theme_colors?.length === 2 ? [hex(u.theme_colors[0]), hex(u.theme_colors[1])] : null);
/** Bio and theme colours aren't in the basic public profile; this lookup returns them for tracked users. */
async function loadExtras(id: string): Promise<{ bio?: string | null; theme_colors?: [number, number] | null } | null> {
  try {
    const res = await fetch(`https://dcdn.dstn.to/profile/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const j = (await res.json()) as { user_profile?: { bio?: string; theme_colors?: [number, number] } };
    return j.user_profile ? { bio: j.user_profile.bio, theme_colors: j.user_profile.theme_colors } : null;
  } catch { return null; }
}
const PROFILE_KEY = "ore-hub-discord-v1";
function paintProfile(u: DiscordUser, id: string): void {
  const set = (el: string, fn: (n: HTMLElement) => void) => { const n = $(el, app); if (n) fn(n); };
  const av = u.avatar;
  if (av) set("#pf-av", (n) => ((n as HTMLImageElement).src = `${CDN}/avatars/${id}/${av}.${av.startsWith("a_") ? "gif" : "png"}?size=256`));
  set("#pf-deco", (n) => {
    const a = u.avatar_decoration_data?.asset;
    n.toggleAttribute("hidden", !a);
    if (a) (n as HTMLImageElement).src = `${CDN}/avatar-decoration-presets/${a}.png?size=240&passthrough=true`;
  });
  set("#pf-banner", (n) => {
    const color = u.banner_color ?? (u.accent_color != null ? `#${u.accent_color.toString(16).padStart(6, "0")}` : DEFAULT_PROFILE.bannerColor);
    n.style.setProperty("--banner", color);
    n.style.setProperty("--banner-img", u.banner ? `url("${CDN}/banners/${id}/${u.banner}.${u.banner.startsWith("a_") ? "gif" : "png"}?size=600")` : "none");
  });
  set("#pf-user", (n) => (n.textContent = u.username));
  const bio = u.bio ?? SITE.discordBio;
  if (bio) {
    set("#pf-bio", (n) => { n.innerHTML = mdToHtml(bio); n.removeAttribute("hidden"); });
    set("#pf-tagline", (n) => n.setAttribute("hidden", ""));
  }
  paintTheme(themeOf(u) ?? (SITE.discordTheme as [string, string] | undefined));
  const g = u.primary_guild;
  set("#pf-clan", (n) => {
    n.toggleAttribute("hidden", !g);
    if (g) {
      n.lastChild!.textContent = g.tag;
      ($("#pf-clan-badge", app) as HTMLImageElement).src = `${CDN}/clan-badges/${g.identity_guild_id}/${g.badge}.png?size=32`;
    }
  });
}
/** Refreshes the card from the public Discord profile (cached for 6h; the snapshot above is the fallback). */
async function loadDiscordProfile(id: string): Promise<void> {
  try {
    const cached = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null") as { t: number; id: string; u: DiscordUser } | null;
    if (cached && cached.id === id && Date.now() - cached.t < 6 * 3600_000) return paintProfile(cached.u, id);
  } catch { /* storage unavailable: fall through to a fresh fetch */ }
  try {
    const res = await fetch(`https://japi.rest/discord/v1/user/${encodeURIComponent(id)}`);
    if (!res.ok) return;
    const u = ((await res.json()) as { data?: DiscordUser }).data;
    if (!u) return;
    Object.assign(u, (await loadExtras(id)) ?? {});
    paintProfile(u, id);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify({ t: Date.now(), id, u })); } catch { /* ignore */ }
  } catch { /* offline or blocked: the snapshot stays */ }
}
paintTheme(SITE.discordTheme as [string, string] | undefined);
if (SITE.discordUserId) void loadDiscordProfile(SITE.discordUserId);
$("#pf-handle", app)?.addEventListener("click", () => {
  navigator.clipboard?.writeText($("#pf-user", app)!.textContent ?? "").catch(() => {});
  toast("Discord username copied");
});

/* ------------------------- loading hero animation ------------------------ */
const barFill = $<HTMLElement>("#bar i", app)!;
const msg = $("#load-msg", app)!;
let raf = 0;
function runLoad(): void {
  cancelAnimationFrame(raf);
  const t0 = performance.now();
  const dur = 2600;
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 2.2);
    barFill.style.width = `${eased * 100}%`;
    msg.textContent = LOAD_MSGS[Math.min(LOAD_MSGS.length - 1, Math.floor(p * LOAD_MSGS.length))]!;
    app.classList.toggle("loaded", p >= 1);
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
runLoad();
$("#bar", app)!.addEventListener("click", runLoad);

let tipI = 0;
const nextTip = () => {
  tipI = (tipI + 1) % TIPS.length;
  const s = $("#tip span", app)!;
  s.style.opacity = "0";
  setTimeout(() => ((s.textContent = TIPS[tipI]!), (s.style.opacity = "1")), 180);
};
$("#tip-next", app)!.addEventListener("click", nextTip);
setInterval(nextTip, 6000);

/* -------------------------- pointer effects ------------------------------ */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const tiles = $<HTMLElement>(".tiles", app)!;
if (!reduce) {
  addEventListener("pointermove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    tiles.style.setProperty("--px", `${x * -30}px`);
    tiles.style.setProperty("--py", `${y * -30}px`);
  });
  const attachTilt = (el: HTMLElement, max: number) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    });
    el.addEventListener("pointerleave", () => ["--rx", "--ry"].forEach((v) => el.style.setProperty(v, "0deg")));
  };
  attachTilt($("#profile", app)!, 14);
  $$("#work ~ .group .card", app).forEach((c) => attachTilt(c, 6));
}

/* scroll progress + reveal + active nav */
const prog = $<HTMLElement>(".scroll-bar i", app)!;
addEventListener("scroll", () => {
  const h = document.documentElement;
  prog.style.width = `${(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100}%`;
}, { passive: true });
/* top bar: current-section highlight + mobile menu */
const secLinks = $$<HTMLAnchorElement>(".tb-link[data-sec]", app);
const secs = secLinks.map((a) => document.getElementById(a.dataset["sec"]!)!);
const topbar = $<HTMLElement>(".topbar", app)!;
const headerH = () => topbar.getBoundingClientRect().height;
let navLock: string | null = null; // while a nav click is scrolling, highlight its target instead of whatever passes by
function markSection(): void {
  const doc = document.documentElement;
  let cur = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= headerH() + 80) cur = i; });
  if (doc.scrollTop + innerHeight >= doc.scrollHeight - 4) cur = secs.length - 1;
  if (navLock) cur = secLinks.findIndex((a) => a.dataset["sec"] === navLock);
  secLinks.forEach((a, i) => (i === cur ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
}
addEventListener("scroll", markSection, { passive: true });
markSection();

/** Scrolls to a section, re-measuring every frame so images loading or reveal animations can't make it land short or long. */
let scrollRaf = 0;
function goToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  cancelAnimationFrame(scrollRaf);
  const target = () => {
    if (id === "top") return 0;
    const gap = id === "work" ? 0 : id === "contact" ? 12 : 8;
    const max = document.documentElement.scrollHeight - innerHeight;
    return Math.max(0, Math.min(max, el.getBoundingClientRect().top + scrollY - headerH() - gap));
  };
  const from = scrollY;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dur = reduce ? 0 : Math.min(900, 350 + Math.abs(target() - from) * 0.12);
  const t0 = performance.now();
  navLock = id;
  const stop = () => { cancelAnimationFrame(scrollRaf); navLock = null; markSection(); removeEventListener("wheel", stop); removeEventListener("touchstart", stop); removeEventListener("keydown", stop); };
  addEventListener("wheel", stop, { passive: true, once: true });
  addEventListener("touchstart", stop, { passive: true, once: true });
  addEventListener("keydown", stop, { once: true });
  const step = (now: number) => {
    const t = dur ? Math.min(1, (now - t0) / dur) : 1;
    const e = 1 - Math.pow(1 - t, 3);
    document.documentElement.style.scrollBehavior = "auto";
    scrollTo(0, from + (target() - from) * e);
    if (t < 1) scrollRaf = requestAnimationFrame(step);
    else {
      scrollTo(0, target());
      document.documentElement.style.scrollBehavior = "";
      stop();
    }
  };
  scrollRaf = requestAnimationFrame(step);
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}
app.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]:not([href^="#/"])');
  if (!a) return;
  const id = a.getAttribute("href")!.slice(1);
  if (!document.getElementById(id)) return;
  e.preventDefault();
  goToSection(id);
});
if (/^#(work|about|contact)$/.test(location.hash)) addEventListener("load", () => setTimeout(() => goToSection(location.hash.slice(1)), 400), { once: true });
const menu = $<HTMLButtonElement>(".tb-menu", app)!;
const tbNav = $("#tb-nav", app)!;
const setMenu = (open: boolean) => { tbNav.classList.toggle("open", open); menu.setAttribute("aria-expanded", String(open)); };
menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
tbNav.addEventListener("click", (e) => (e.target as HTMLElement).closest("a") && setMenu(false));

const io = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))), { threshold: 0.12 });
$$(".reveal", app).forEach((n) => io.observe(n));

/* ----------------------------- search / filter --------------------------- */
let filter = "all";
const q = $<HTMLInputElement>("#q", app)!;
function apply(): void {
  const term = q.value.trim().toLowerCase();
  let shown = 0;
  $$(".group", app).forEach((g) => {
    let n = 0;
    $$<HTMLElement>(".card", g).forEach((c) => {
      const ok = (filter === "all" || c.dataset["cat"] === filter) && (!term || c.dataset["search"]!.includes(term));
      c.hidden = !ok;
      if (ok) n++;
    });
    g.hidden = n === 0;
    shown += n;
  });
  $("#empty", app)!.hidden = shown > 0;
}
q.addEventListener("input", apply);
tablist($("#filters", app)!, (id) => ((filter = id), apply()));
addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== q && !(document.activeElement instanceof HTMLTextAreaElement)) {
    e.preventDefault();
    q.focus();
    q.scrollIntoView({ block: "center", behavior: "smooth" });
  } else if (e.key === "Escape" && document.activeElement === q) q.blur();
});

/* ------------------------------ project modal ---------------------------- */
const dlg = $<HTMLDialogElement>("#pm", app)!;
let cur: Entry | null = null;
let shot = 0;

function renderShot(): void {
  const g = cur!.p.gallery ?? [];
  const matte = $("#pm-matte", app)!;
  const shotEl = $("#pm-shot", app)!;
  matte.classList.toggle("single", g.length < 2);
  if (!g.length) {
    const c = cur!.p.cover;
    matte.style.setProperty("--bg", c ? `url("${c}")` : "none");
    shotEl.innerHTML = `<figure class="fig">${c ? `<img src="${escapeHtml(c)}" alt="">` : coverHtml(cur!)}</figure>`;
    $("#pm-counter", app)!.textContent = "";
    $("#pm-fig", app)!.textContent = "00";
    $("#pm-type", app)!.textContent = "COVER";
    $("#pm-cap", app)!.textContent = "No screenshots yet. Showing the cover art.";
    watchSize(shotEl);
    return;
  }
  const m = g[shot]!;
  const src = escapeHtml(resolveMediaPath(m.url));
  const poster = m.poster ? resolveMediaPath(m.poster) : "";
  const bgUrl = `url("${poster || resolveMediaPath(m.url)}")`;
  // the card's cover is already cached, so the blurred backdrop is never empty while the shot loads
  matte.style.setProperty("--bg", warmed.has(m.url) || !cur!.p.cover ? bgUrl : `url("${cur!.p.cover}")`);
  shotEl.innerHTML = `<figure class="fig">${isVideoMedia(m)
    ? `<video src="${src}" controls playsinline poster="${escapeHtml(poster)}"></video>`
    : `<img src="${src}" alt="${escapeHtml(m.caption ?? "")}" decoding="async" fetchpriority="high" class="loading">`}</figure>`;
  const shown = shotEl.querySelector<HTMLImageElement>("img");
  if (shown) {
    const done = () => { shown.classList.remove("loading"); matte.style.setProperty("--bg", bgUrl); };
    shown.complete ? done() : shown.addEventListener("load", done, { once: true });
  }
  // neighbours first, so next/back feel instant
  [g[(shot + 1) % g.length], g[(shot - 1 + g.length) % g.length]].forEach((x) => x && !isVideoMedia(x) && prefetch(x.url));
  $("#pm-counter", app)!.textContent = `${shot + 1} / ${g.length}`;
  $("#pm-fig", app)!.textContent = String(shot + 1).padStart(2, "0");
  $("#pm-type", app)!.textContent = (m.url.split(".").pop() ?? "img").toUpperCase().slice(0, 5);
  $("#pm-cap", app)!.textContent = m.caption ?? "";
  watchSize(shotEl);
  $$(".thumb", app).forEach((t, i) => t.classList.toggle("on", i === shot));
}
/** Warm the browser cache so an image is ready by the time it's shown. */
const warmed = new Set<string>();
function prefetch(url: string | undefined): void {
  if (!url || warmed.has(url)) return;
  warmed.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = resolveMediaPath(url);
}
const prefetchProject = (slug: string | undefined, n = 2) =>
  entries.find((x) => x.slug === slug)?.p.gallery?.slice(0, n).forEach((m) => !isVideoMedia(m) && prefetch(m.url));

/** Shows the media's native resolution in the frame's readout once it has loaded. */
function watchSize(root: HTMLElement): void {
  const dim = $("#pm-dim", app)!;
  dim.textContent = "…";
  const media = root.querySelector<HTMLImageElement | HTMLVideoElement>("img, video");
  if (!media) { dim.textContent = "—"; return; }
  const set = () => {
    const w = media instanceof HTMLImageElement ? media.naturalWidth : media.videoWidth;
    const h = media instanceof HTMLImageElement ? media.naturalHeight : media.videoHeight;
    dim.textContent = w && h ? `${w}×${h}` : "—";
  };
  if (media instanceof HTMLImageElement) media.complete ? set() : media.addEventListener("load", set, { once: true });
  else media.addEventListener("loadedmetadata", set, { once: true });
}
const go = (d: number) => {
  const n = cur?.p.gallery?.length ?? 0;
  if (n > 1) { shot = (shot + d + n) % n; renderShot(); if (lb.open) paintLightbox(); }
};

/* ------------------------- full-screen image viewer ------------------------ */
const lb = document.createElement("dialog");
lb.className = "lb";
lb.setAttribute("aria-label", "Full screen image");
lb.innerHTML = `<img class="lb-img" alt="" decoding="async">
  <button type="button" class="lb-close ore-icon-button" data-ore-icon="cross" aria-label="Close full screen"></button>
  <button type="button" class="lb-nav lb-prev ore-icon-button" data-ore-icon="chevron-left" aria-label="Previous"></button>
  <button type="button" class="lb-nav lb-next ore-icon-button" data-ore-icon="chevron-right" aria-label="Next"></button>
  <div class="lb-cap"><span class="lb-count"></span><span class="lb-text"></span></div>`;
app.appendChild(lb);
hydrateIcons(lb);
function paintLightbox(): void {
  const g = cur?.p.gallery ?? [];
  const m = g[shot];
  const img = lb.querySelector<HTMLImageElement>(".lb-img")!;
  const src = m ? resolveMediaPath(m.url) : cur?.p.cover ?? "";
  img.classList.add("loading");
  img.onload = () => img.classList.remove("loading");
  img.src = src;
  if (img.complete) img.classList.remove("loading");
  img.alt = m?.caption ?? cur?.p.title ?? "";
  lb.querySelector(".lb-count")!.textContent = g.length > 1 ? `${shot + 1} / ${g.length}` : "";
  lb.querySelector(".lb-text")!.textContent = m?.caption ?? "";
  lb.classList.toggle("single", g.length < 2);
}
function openLightbox(): void {
  if (!cur) return;
  paintLightbox();
  if (!lb.open) lb.showModal();
}
lb.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest(".lb-prev")) return go(-1);
  if (t.closest(".lb-next")) return go(1);
  lb.close();
});
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});
let lbX = 0;
lb.addEventListener("touchstart", (e) => { lbX = e.touches[0]?.clientX ?? 0; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - lbX;
  if (Math.abs(dx) > 50) { go(dx < 0 ? 1 : -1); e.preventDefault(); }
}, { passive: false });

function open(slug: string, push = true): void {
  const e = entries.find((x) => x.slug === slug);
  if (!e) return;
  cur = e; shot = 0;
  dlg.style.setProperty("--accent", e.p.color ?? "#5fbf4b");
  $("#pm-thumbs", app)!.innerHTML = (e.p.gallery ?? []).length > 1
    ? e.p.gallery!.map((m, i) => `<button class="thumb" data-i="${i}" aria-label="Screenshot ${i + 1}"><img src="${escapeHtml(resolveMediaPath(m.poster ?? m.url))}" alt="" loading="lazy" decoding="async" fetchpriority="low"></button>`).join("")
    : "";
  $("#pm-plate", app)!.textContent = e.p.title;
  const shots = e.p.gallery?.length ?? 0;
  $("#pm-info", app)!.innerHTML = `
    <div class="pm-kicker">${statusTag(e.status)}<span>${shots ? `${shots} screenshot${shots === 1 ? "" : "s"}` : "No screenshots"}</span></div>
    <h2 id="pm-title">${e.p.icon ? iconHtml(e.p.icon, "ico") : ""}${escapeHtml(e.p.title)}</h2>
    <p class="pm-desc">${escapeHtml(e.p.desc ?? "")}</p>
    ${(e.p.tags ?? []).length ? `<div class="pm-sec"><h4>Built with</h4><div class="chips">${e.p.tags!.map((t) => tagHtml(t)).join("")}</div></div>` : ""}
    <div class="pm-actions">${linkButtons(e.p, true)}<button class="ore-button" data-color="neutral" id="copy-link">Copy link</button></div>`;
  renderShot();
  if (!dlg.open) dlg.showModal();
  if (push) history.replaceState(null, "", `#/${slug}`);
}
function close(): void { if (dlg.open) dlg.close(); }
dlg.addEventListener("close", () => history.replaceState(null, "", location.pathname));
dlg.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t === dlg) return close();
  if (t.closest("#pm-close")) return close();
  if (t.closest(".prev")) return go(-1);
  if (t.closest(".next")) return go(1);
  if (t.closest(".fig img")) return openLightbox();
  const th = t.closest<HTMLElement>(".thumb");
  if (th) { shot = Number(th.dataset["i"]); renderShot(); }
  if (t.closest("#copy-link") && cur) {
    navigator.clipboard?.writeText(`${location.origin}${location.pathname}#/${cur.slug}`).catch(() => {});
    toast("Link copied");
  }
});
dlg.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});
$$(".card", app).forEach((c) => {
  ["pointerenter", "focus", "touchstart"].forEach((ev) => c.addEventListener(ev, () => prefetchProject(c.dataset["slug"]), { passive: true }));
  c.addEventListener("click", () => open(c.dataset["slug"]!));
  c.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(c.dataset["slug"]!)));
});
const fromHash = () => {
  const m = location.hash.match(/^#\/(.+)$/);
  const p = decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g, "")); // Discord link pages live at /<slug>
  if (m) open(decodeURIComponent(m[1]!), false);
  else if (p && entries.some((x) => x.slug === p)) open(p, false);
};
fromHash();

let toastT = 0;
function toast(text: string): void {
  const t = $("#toast", app)!;
  t.textContent = text; t.classList.add("on");
  clearTimeout(toastT);
  toastT = window.setTimeout(() => t.classList.remove("on"), 1600);
}

/* ------------------------------ services pane ---------------------------- */
const svcTabs = $$<HTMLButtonElement>(".svc-tab", app);
const detail = $("#svc-detail", app)!;
let svcI = 0, svcAuto = !reduce, svcTimer = 0;
const SVC_MS = 6500;
function showSvc(i: number, user = false): void {
  svcI = i;
  const s = SITE.services[i]!;
  svcTabs.forEach((t, n) => t.setAttribute("aria-selected", String(n === i)));
  detail.innerHTML = `<div class="svc-swap"><div class="big">${escapeHtml(s.icon)}</div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.desc)}</p></div>
    <span class="svc-count">${String(i + 1).padStart(2, "0")} / ${String(SITE.services.length).padStart(2, "0")}</span><i class="svc-timer"></i>`;
  if (user) svcAuto = false;
  clearTimeout(svcTimer);
  const bar = detail.querySelector<HTMLElement>(".svc-timer")!;
  if (svcAuto) {
    bar.style.setProperty("--dur", `${SVC_MS}ms`);
    requestAnimationFrame(() => bar.classList.add("run"));
    svcTimer = window.setTimeout(() => showSvc((svcI + 1) % SITE.services.length), SVC_MS);
  }
}
svcTabs.forEach((t, i) => {
  t.addEventListener("click", () => showSvc(i, true));
  t.addEventListener("mouseenter", () => matchMedia("(hover: hover)").matches && showSvc(i, true));
});
showSvc(0);

/* ------------------------------ toolbelt -------------------------------- */
const slots = $$<HTMLButtonElement>(".slot:not(.empty)", app);
const beltName = $("#belt-name", app)!;
const pick = (i: number) => {
  const s = slots[i];
  if (!s) return;
  slots.forEach((x) => x.setAttribute("aria-selected", String(x === s)));
  beltName.textContent = s.dataset["name"] ?? "";
};
slots.forEach((s, i) => ["mouseenter", "click", "focus"].forEach((ev) => s.addEventListener(ev, () => pick(i))));
pick(0);
addEventListener("keydown", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest("input, textarea, dialog") || e.ctrlKey || e.metaKey || e.altKey) return;
  const n = Number(e.key);
  if (n >= 1 && n <= 9) pick(n - 1);
});

// count-up stats
$$(".stat b", app).forEach((b) => {
  const m = b.textContent!.match(/^(\d+)(.*)$/);
  if (!m || reduce) return;
  const end = Number(m[1]), suffix = m[2]!;
  const so = new IntersectionObserver(([en]) => {
    if (!en!.isIntersecting) return;
    so.disconnect();
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      b.textContent = `${Math.round(end * p)}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  so.observe(b);
});
void active;
