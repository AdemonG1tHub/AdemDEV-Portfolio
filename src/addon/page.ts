import "@/lib/oreui";
import "@/styles/addon.css";

import { SITE } from "@/config/site.config";
import { resolveLinkColor, resolveTextColor } from "@/lib/colors";
import { byId, el, escapeHtml, onReady } from "@/lib/dom";
import { stripMcCodes } from "@/lib/mcText";
import { initNav } from "@/lib/nav";
import { hydrateIcons, setButtonColor, setButtonTextColor } from "@/lib/oreui";
import { observeReveals, revealAll } from "@/lib/reveal";
import { createUiSounds } from "@/lib/sound";
import type { AddonPageConfig, AddonTheme } from "@/types/addon";
import type { LinkButton } from "@/types/site";
import { initFeatureExplorer } from "./features";
import { createMenuViewer } from "./menuViewer";

/**
 * One renderer for every add-on page.
 *
 * `src/pages/<slug>.ts` calls this with a config from `src/config/addons/`;
 * the markup in `<slug>/index.html` is identical across add-ons, so a new page
 * needs a config, an HTML entry and a Vite input — nothing here changes.
 */

/** Theme keys map 1:1 onto the `--accent-*` / surface tokens in tokens.css. */
const THEME_VARS: Record<keyof AddonTheme, string> = {
  accent: "--accent",
  accentBright: "--accent-bright",
  accentSoft: "--accent-soft",
  accentLight: "--accent-light",
  accentDeep: "--accent-deep",
  accentLine: "--accent-line",
  accentInk: "--accent-ink",
  accentLink: "--accent-link",
  surface: "--surface",
  surfaceAlt: "--surface-alt",
  surfaceDark: "--surface-dark",
  surfaceCard: "--surface-card",
  line: "--line",
  lineSoft: "--line-soft",
  themeColor: "--theme-color",
};

function applyTheme(theme: AddonTheme): void {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(THEME_VARS)) {
    root.style.setProperty(cssVar, theme[key as keyof AddonTheme]);
  }

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme.themeColor;
}

function linkButton(link: LinkButton, extraClass = ""): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.href = link.url;
  if (/^https?:/i.test(link.url)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  anchor.className = `ore-button${extraClass ? ` ${extraClass}` : ""}`;
  setButtonColor(anchor, resolveLinkColor(link.color, "gold"));
  setButtonTextColor(anchor, resolveTextColor(link.textColor));
  anchor.textContent = link.label;
  return anchor;
}

function heroButton(link: LinkButton): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.href = link.url;
  if (/^https?:/i.test(link.url)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  anchor.className = "ore-button hero-btn";
  anchor.dataset["variant"] = "hero";
  setButtonColor(anchor, resolveLinkColor(link.color, "gold"));
  anchor.textContent = link.label;
  return anchor;
}

function renderHero(config: AddonPageConfig): void {
  document.title = `${config.name} — ${SITE.name}`;

  const hero = byId("addon-hero");
  if (hero) hero.style.setProperty("--bg-url", `url('${config.heroBackground}')`);

  const title = byId("hero-title");
  if (title) title.textContent = config.name;

  const sub = byId("hero-sub");
  if (sub) sub.textContent = config.subtitle;

  const badge = byId("hero-badge");
  if (badge) badge.textContent = `${config.version} · Bedrock ${config.minEngineVersion}+`;

  const actions = byId("hero-actions");
  if (actions) for (const link of config.heroLinks) actions.append(heroButton(link));

  const stats = byId("addon-stats");
  if (stats) {
    for (const stat of config.stats) {
      stats.insertAdjacentHTML(
        "beforeend",
        `<div class="addon-stat"><span class="addon-stat__num">${escapeHtml(stat.num)}</span><span class="addon-stat__label">${escapeHtml(stat.label)}</span></div>`,
      );
    }
  }
}

function renderDownload(config: AddonPageConfig): void {
  const heading = byId("download-heading");
  if (heading) heading.textContent = config.download.heading;

  const note = byId("download-note");
  if (note) note.textContent = config.download.note;

  const file = byId("download-file");
  if (file) file.textContent = config.download.fileName;

  const buttons = byId("download-buttons");
  if (buttons) for (const link of config.download.buttons) buttons.append(linkButton(link, "download-btn"));
}

export function initAddonPage(config: AddonPageConfig): void {
  applyTheme(config.theme);

  onReady(() => {
    const sfx = createUiSounds();

    hydrateIcons();
    renderHero(config);
    renderDownload(config);

    const copy = byId("footer-copy");
    if (copy) copy.textContent = `© ${new Date().getFullYear()} ${SITE.name} — ${config.footer.tagLine}`;

    // --- live menu viewer ---------------------------------------------------
    const stage = byId("menu-stage");
    const viewer = stage ? createMenuViewer(stage, config.viewer, { onSound: () => sfx.play() }) : null;

    byId("menu-reset")?.addEventListener("click", () => {
      sfx.play();
      viewer?.reset();
    });

    // Quick-jump chips for the root menu and everything one step below it —
    // deeper screens are reachable by clicking through, and listing them all
    // would just duplicate the menu itself.
    const jumps = byId("menu-jumps");
    if (jumps && viewer) {
      const root = config.viewer.rootMenu;
      for (const [id, menu] of Object.entries(config.viewer.menus)) {
        if (id !== root && menu.back !== root) continue;
        const label =
          menu.navLabel ??
          stripMcCodes(menu.title)
            .replace(/\{player\}/g, config.viewer.playerName)
            .replace(/\{server\}/g, config.viewer.serverName);
        const chip = el("button", {
          className: "ore-button menu-jump",
          attrs: { type: "button" },
          dataset: { color: "neutral" },
          text: label,
        });
        chip.addEventListener("click", () => {
          sfx.play();
          viewer.goTo(id);
        });
        jumps.append(chip);
      }
    }

    // --- features -----------------------------------------------------------
    const grid = byId("feature-grid");
    const detail = byId("feature-detail");
    if (grid && detail) {
      initFeatureExplorer({
        features: config.features,
        grid,
        detail,
        demoColor: config.demoButtonColor ?? "gold",
        onSelect: () => {
          sfx.play();
          if (window.matchMedia("(max-width: 980px)").matches) {
            detail.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        },
        onDemo: (menuId) => {
          viewer?.goTo(menuId);
          byId("preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      });
    }

    initNav();
    sfx.bind(".ore-button:not(.menu-jump, #menu-reset), #nav-toggle, #nav a");

    window.setTimeout(() => {
      revealAll();
      observeReveals();
    }, 80);
  });
}
