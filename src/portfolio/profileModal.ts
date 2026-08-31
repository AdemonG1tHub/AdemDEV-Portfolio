import { SITE } from "@/config/site.config";
import { resolveLinkColor, resolveTextColor } from "@/lib/colors";
import { byId } from "@/lib/dom";
import { fetchMarkdown, normalizeGithubUrl, normalizeIndent, renderMarkdown } from "@/lib/markdown";
import { initFontToggle } from "./fontToggle";

/** Nav "Profile" entry — renders a remote markdown README in a modal. */
export function initProfileModal(): void {
  const cfg = SITE.profileMenu ?? {};
  const navLink = byId<HTMLAnchorElement>("nav-profile");
  const modal = byId("profile-modal");
  const descEl = byId("pm-desc");
  const linksEl = byId("pm-links");
  if (!navLink || !modal || !descEl || !linksEl) return;

  if (cfg.enabled === false) {
    navLink.remove();
    modal.remove();
    return;
  }

  if (cfg.navLabel) navLink.textContent = cfg.navLabel;
  const titleEl = byId("pm-title");
  if (titleEl && cfg.title) titleEl.textContent = cfg.title;
  const accentEl = byId("pm-accent-dot");
  if (accentEl) accentEl.style.background = cfg.accentColor ?? "#6fe784";

  const fonts = initFontToggle({
    storageKey: "profileModalFont",
    modal,
    bodyClass: "pm-font-minecraft",
    defaultButtonId: "pm-font-default",
    minecraftButtonId: "pm-font-minecraft",
  });

  let loaded = false;

  async function loadMarkdown(): Promise<void> {
    if (loaded) return;
    descEl!.innerHTML = '<div class="gm-placeholder-sub">Loading…</div>';
    const md = normalizeIndent(await fetchMarkdown(normalizeGithubUrl(cfg.markdownUrl ?? "")));
    if (!md) {
      descEl!.innerHTML = '<div class="gm-placeholder-sub">No content available.</div>';
      return;
    }
    descEl!.innerHTML = renderMarkdown(md);
    loaded = true;
  }

  function renderButtons(): void {
    linksEl!.replaceChildren();
    for (const button of cfg.buttons ?? []) {
      if (!button.label || !button.url) continue;
      const anchor = document.createElement("a");
      anchor.href = button.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.className = `card-btn modal-btn ${resolveLinkColor(button.color, SITE.defaults.linkColor)}`;
      const textColor = resolveTextColor(button.textColor);
      if (textColor) anchor.style.color = textColor;
      anchor.textContent = button.label;
      linksEl!.append(anchor);
    }
  }

  function close(): void {
    modal!.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openProfile(): void {
    renderButtons();
    void loadMarkdown();
    fonts.apply();
    modal!.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  navLink.addEventListener("click", (event) => {
    event.preventDefault();
    byId("nav")?.classList.remove("open");
    openProfile();
  });

  byId("pm-close")?.addEventListener("click", close);
  byId("pm-backdrop")?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) close();
  });
}
