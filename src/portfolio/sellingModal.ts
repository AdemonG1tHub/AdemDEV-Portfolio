import { SITE } from "@/config/site.config";
import { resolveLinkColor, resolveTextColor } from "@/lib/colors";
import { byId, requireId } from "@/lib/dom";
import { setIcon } from "@/lib/icon";
import { initFontToggle } from "./fontToggle";
import { renderMarkdownInto } from "./markdownPane";
import type { ModalController } from "./galleryModal";
import { createMediaViewer } from "./mediaViewer";
import { clearDetailPath, routeState, setDetailPath, toSlug } from "./routing";

/** Store item modal: media carousel plus a markdown description. */
export function initSellingModal(): ModalController {
  const modal = requireId("selling-modal");
  const viewer = createMediaViewer({
    image: requireId<HTMLImageElement>("sm-main-img"),
    video: byId<HTMLVideoElement>("sm-main-video"),
    videoNote: byId("sm-video-note"),
    placeholder: byId("sm-placeholder"),
    caption: byId("sm-caption"),
    captionBar: byId("sm-caption-bar"),
    counter: byId("sm-counter"),
    thumbs: byId("sm-thumbs"),
    prev: byId<HTMLButtonElement>("sm-prev"),
    next: byId<HTMLButtonElement>("sm-next"),
  });

  const titleEl = requireId("sm-title");
  const dotEl = requireId("sm-accent-dot");
  const descEl = requireId("sm-desc");
  descEl.classList.add("md-body");
  const linksEl = requireId("sm-links");
  const phIcon = byId("sm-ph-icon");

  const fonts = initFontToggle({
    storageKey: "sellingModalFont",
    modal,
    bodyClass: "sm-font-minecraft",
    defaultButtonId: "sm-font-default",
    minecraftButtonId: "sm-font-minecraft",
  });

  // Keep clicks and wheel events inside the description from reaching the modal.
  descEl.addEventListener("click", (event) => event.stopPropagation());
  descEl.addEventListener(
    "wheel",
    (event) => {
      const canScrollDown = descEl.scrollTop + descEl.clientHeight < descEl.scrollHeight - 1;
      const canScrollUp = descEl.scrollTop > 0;
      const scrollsInside = (event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp);
      if (!scrollsInside) event.preventDefault();
      event.stopPropagation();
    },
    { passive: false },
  );

  function isOpen(): boolean {
    return modal.classList.contains("open");
  }

  function close(): void {
    if (!isOpen()) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    viewer.pause();
    if (!routeState.syncing) clearDetailPath();
  }

  function open(index: number, options: { skipRouteUpdate?: boolean } = {}): void {
    const item = SITE.currentlySelling[index];
    if (!item) return;

    titleEl.textContent = item.title;
    dotEl.style.background = item.color ?? "#666";
    setIcon(phIcon, item.icon, "📦");

    linksEl.replaceChildren();
    for (const link of item.links ?? []) {
      const anchor = document.createElement("a");
      anchor.href = link.url;
      if (/^https?:/i.test(link.url)) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      anchor.className = `card-btn modal-btn ${resolveLinkColor(link.color, SITE.defaults.linkColor)}`;
      const textColor = resolveTextColor(link.textColor);
      if (textColor) anchor.style.color = textColor;
      anchor.textContent = link.label;
      linksEl.append(anchor);
    }

    viewer.load(item.images ?? []);
    fonts.apply();
    descEl.classList.add("expanded");
    void renderMarkdownInto(descEl, item.md);

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    if (!options.skipRouteUpdate) {
      setDetailPath(routeState.sellingSlugs[index] ?? toSlug(item.id || item.title));
    }
  }

  byId("sm-close")?.addEventListener("click", close);
  byId("sm-backdrop")?.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") close();
    if (viewer.isVideoFocused(event.target)) return;
    if (event.key === "ArrowLeft") viewer.step(-1);
    if (event.key === "ArrowRight") viewer.step(1);
  });

  return { open, close, isOpen };
}
