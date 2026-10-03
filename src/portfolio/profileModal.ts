import { SITE } from "@/config/site.config";
import { resolveLinkColor, resolveTextColor } from "@/lib/colors";
import { byId } from "@/lib/dom";
import { fetchMarkdown, normalizeGithubUrl, normalizeIndent, renderMarkdown } from "@/lib/markdown";
import { setButtonColor, setButtonTextColor } from "@/lib/oreui";
import { bindDialog } from "./dialog";
import { initFontToggle } from "./fontToggle";

/** Nav "Profile" entry — renders a remote markdown README in a modal. */
export function initProfileModal(): void {
  const cfg = SITE.profileMenu ?? {};
  const navLink = byId<HTMLAnchorElement>("nav-profile");
  const modal = byId<HTMLDialogElement>("profile-modal");
  const descEl = byId("pm-desc");
  const linksEl = byId("pm-links");
  if (!navLink || !modal || !descEl || !linksEl) return;

  if (cfg.enabled === false) {
    navLink.remove();
    modal.remove();
    return;
  }

  const navLabel = navLink.querySelector(".ore-navbar-action-label") ?? navLink;
  if (cfg.navLabel) navLabel.textContent = cfg.navLabel;
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
      anchor.className = "ore-button";
      setButtonColor(anchor, resolveLinkColor(button.color, SITE.defaults.linkColor));
      setButtonTextColor(anchor, resolveTextColor(button.textColor));
      anchor.textContent = button.label;
      linksEl!.append(anchor);
    }
  }

  const dialog = bindDialog(modal);

  function openProfile(): void {
    renderButtons();
    void loadMarkdown();
    fonts.apply();
    dialog.open();
  }

  navLink.addEventListener("click", (event) => {
    event.preventDefault();
    byId("nav")?.classList.remove("open");
    openProfile();
  });

  // Escape and backdrop clicks are handled by the dialog itself.
  byId("pm-close")?.addEventListener("click", dialog.close);
}
