import { SITE } from "@/config/site.config";
import { resolveLinkColor, resolveTextColor } from "@/lib/colors";
import { byId, requireId } from "@/lib/dom";
import { setIcon } from "@/lib/icon";
import { oreTagHtml, setButtonColor, setButtonTextColor } from "@/lib/oreui";
import { bindDialog, isTabTarget } from "./dialog";
import { initFontToggle } from "./fontToggle";
import { renderMarkdownInto } from "./markdownPane";
import { createMediaViewer } from "./mediaViewer";
import { clearDetailPath, routeState, setDetailPath, toSlug } from "./routing";

export interface ModalController {
  open(index: number, options?: { skipRouteUpdate?: boolean }): void;
  close(): void;
  isOpen(): boolean;
}

/** Project gallery: screenshots, description, links and tags. */
export function initGalleryModal(): ModalController {
  const modal = requireId<HTMLDialogElement>("gallery-modal");
  const viewer = createMediaViewer({
    image: requireId<HTMLImageElement>("gm-main-img"),
    video: byId<HTMLVideoElement>("gm-main-video"),
    videoNote: byId("gm-video-note"),
    placeholder: byId("gm-placeholder"),
    caption: byId("gm-caption"),
    captionBar: byId("gm-caption-bar"),
    counter: byId("gm-counter"),
    thumbs: byId("gm-thumbs"),
    prev: byId<HTMLButtonElement>("gm-prev"),
    next: byId<HTMLButtonElement>("gm-next"),
  });

  const nameEl = requireId("gm-project-name");
  const dotEl = requireId("gm-accent-dot");
  const descEl = requireId("gm-info-desc");
  const linksEl = requireId("gm-info-links");
  const tagsEl = requireId("gm-tags");
  const phIcon = byId("gm-ph-icon");
  const fontRow = byId("gm-font-row");

  const fonts = initFontToggle({
    storageKey: "projectModalFont",
    modal,
    bodyClass: "gm-font-minecraft",
    defaultButtonId: "gm-font-default",
    minecraftButtonId: "gm-font-minecraft",
  });

  // Long-form descriptions scroll inside the pane rather than the whole modal.
  descEl.addEventListener("click", (event) => event.stopPropagation());
  descEl.addEventListener(
    "wheel",
    (event) => {
      if (!descEl.classList.contains("md-body")) return;
      const canScrollDown = descEl.scrollTop + descEl.clientHeight < descEl.scrollHeight - 1;
      const canScrollUp = descEl.scrollTop > 0;
      const scrollsInside = (event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp);
      if (!scrollsInside) event.preventDefault();
      event.stopPropagation();
    },
    { passive: false },
  );

  const dialog = bindDialog(modal, () => {
    viewer.pause();
    if (!routeState.syncing) clearDetailPath();
  });

  function open(index: number, options: { skipRouteUpdate?: boolean } = {}): void {
    const project = SITE.projects[index];
    if (!project) return;

    nameEl.textContent = project.title;
    dotEl.style.background = project.color ?? "#666";
    setIcon(phIcon, project.icon, "📷");

    // `md` (inline or a .md path) replaces the plain `desc` blurb and brings
    // the font switcher with it; without one, fall back to `desc` as before.
    const hasMarkdown = Boolean(project.md?.trim());
    descEl.classList.toggle("md-body", hasMarkdown);
    descEl.classList.toggle("expanded", hasMarkdown);
    if (fontRow) fontRow.hidden = !hasMarkdown;

    if (hasMarkdown) {
      fonts.apply();
      void renderMarkdownInto(descEl, project.md);
    } else {
      descEl.textContent = project.desc ?? "";
    }

    linksEl.replaceChildren();
    for (const link of project.links ?? []) {
      const anchor = document.createElement("a");
      anchor.href = link.url;
      if (/^https?:/i.test(link.url)) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      anchor.className = "ore-button";
      setButtonColor(anchor, resolveLinkColor(link.color, SITE.defaults.linkColor));
      setButtonTextColor(anchor, resolveTextColor(link.textColor));
      anchor.textContent = link.label;
      linksEl.append(anchor);
    }

    tagsEl.innerHTML = (project.tags ?? []).map((tag) => oreTagHtml(tag)).join("");

    viewer.load(project.gallery ?? []);

    dialog.open();

    if (!options.skipRouteUpdate) {
      setDetailPath(routeState.projectSlugs[index] ?? toSlug(project.title));
    }
  }

  byId("gm-close")?.addEventListener("click", dialog.close);

  // Escape and backdrop clicks are handled by the dialog itself.
  document.addEventListener("keydown", (event) => {
    if (!dialog.isOpen()) return;
    if (viewer.isVideoFocused(event.target) || isTabTarget(event.target)) return;
    if (event.key === "ArrowLeft") viewer.step(-1);
    if (event.key === "ArrowRight") viewer.step(1);
  });

  return { open, close: dialog.close, isOpen: dialog.isOpen };
}
