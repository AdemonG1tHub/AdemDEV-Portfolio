import { qsa } from "@/lib/dom";
import { initVideoFallback, isVideoMedia, mediaThumbHtml, showMainMedia } from "@/lib/media";
import type { MediaItem } from "@/types/site";

/**
 * The image/video carousel shared by the project and store modals: thumbnail
 * strip, prev/next buttons, caption, counter, and the empty-state placeholder.
 */

export interface MediaViewerElements {
  image: HTMLImageElement;
  video: HTMLVideoElement | null;
  videoNote: HTMLElement | null;
  placeholder: HTMLElement | null;
  caption: HTMLElement | null;
  captionBar: HTMLElement | null;
  counter: HTMLElement | null;
  thumbs: HTMLElement | null;
  prev: HTMLButtonElement | null;
  next: HTMLButtonElement | null;
}

export interface MediaViewer {
  load(items: MediaItem[]): void;
  step(delta: number): void;
  isVideoFocused(target: EventTarget | null): boolean;
  pause(): void;
}

export function createMediaViewer(els: MediaViewerElements, placeholderFallback = "/images/placeholder.svg"): MediaViewer {
  let items: MediaItem[] = [];
  let index = 0;

  els.image.addEventListener("error", () => {
    if (!els.image.getAttribute("src")) return;
    if (els.image.src.endsWith(placeholderFallback)) return;
    els.image.src = placeholderFallback;
  });
  initVideoFallback(els.video, els.videoNote);

  function show(next: number): void {
    if (items.length === 0) return;
    index = Math.max(0, Math.min(next, items.length - 1));
    const item = items[index];

    els.image.classList.add("switching");
    els.video?.classList.add("switching");
    window.setTimeout(() => {
      showMainMedia(els.image, els.video, item, els.videoNote);
      els.image.classList.remove("switching");
      els.video?.classList.remove("switching");
    }, 180);

    if (els.caption) els.caption.textContent = item?.caption ?? "";
    if (els.counter) els.counter.textContent = `${index + 1} / ${items.length}`;
    if (els.prev) els.prev.disabled = index === 0;
    if (els.next) els.next.disabled = index === items.length - 1;

    if (els.thumbs) {
      qsa<HTMLElement>(".gm-thumb", els.thumbs).forEach((thumb) => {
        thumb.classList.toggle("active", Number(thumb.dataset["idx"]) === index);
      });
      const active = els.thumbs.querySelector<HTMLElement>(".gm-thumb.active");
      if (active) {
        const left = active.offsetLeft - els.thumbs.clientWidth / 2 + active.clientWidth / 2;
        els.thumbs.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    }
  }

  function buildThumbs(): void {
    if (!els.thumbs) return;
    els.thumbs.replaceChildren();
    items.forEach((item, i) => {
      const thumb = document.createElement("div");
      thumb.className = `gm-thumb${isVideoMedia(item) ? " is-video" : ""}${i === 0 ? " active" : ""}`;
      thumb.dataset["idx"] = String(i);
      thumb.innerHTML = mediaThumbHtml(item);
      thumb.querySelector("img, video")?.addEventListener("error", () => {
        thumb.innerHTML = `<div class="gm-thumb-placeholder">${isVideoMedia(item) ? "🎞️" : "📷"}</div>`;
      });
      thumb.addEventListener("click", () => show(i));
      els.thumbs!.append(thumb);
    });
  }

  function setEmptyState(empty: boolean): void {
    const shown = empty ? "none" : "";
    if (els.placeholder) els.placeholder.style.display = empty ? "flex" : "none";
    if (els.captionBar) els.captionBar.style.display = empty ? "none" : "flex";
    if (els.thumbs) els.thumbs.style.display = empty ? "none" : "flex";
    // Cleared rather than set, so the stylesheet decides (and can hide them on mobile).
    if (els.prev) els.prev.style.display = empty ? "none" : "";
    if (els.next) els.next.style.display = empty ? "none" : "";
    if (empty) {
      els.image.style.display = "none";
      if (els.video) els.video.style.display = "none";
      if (els.videoNote) els.videoNote.style.display = "none";
    } else {
      els.image.style.display = shown;
    }
  }

  els.prev?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    show(index - 1);
  });
  els.next?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    show(index + 1);
  });

  return {
    load(nextItems: MediaItem[]): void {
      items = nextItems;
      index = 0;
      if (items.length === 0) {
        setEmptyState(true);
        return;
      }
      setEmptyState(false);
      buildThumbs();
      show(0);
    },
    step(delta: number): void {
      show(index + delta);
    },
    isVideoFocused(target: EventTarget | null): boolean {
      return els.video !== null && target === els.video;
    },
    pause(): void {
      els.video?.pause();
    },
  };
}
