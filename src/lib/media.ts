import type { MediaItem } from "@/types/site";
import { escapeHtml } from "./dom";

const VIDEO_EXT_RE = /\.(mp4|m4v|mov|webm|ogv)(?:[?#]|$)/i;

/** A gallery entry is video when it says so, or its URL ends in a video extension. */
export function isVideoMedia(item: MediaItem | undefined): boolean {
  if (!item) return false;
  if (item.type) return item.type === "video";
  return VIDEO_EXT_RE.test(item.url ?? "");
}

/** Absolute URLs pass through; everything else is already root-relative. */
export function resolveMediaPath(url: string | undefined): string {
  if (!url) return "";
  return url;
}

export function mediaThumbHtml(item: MediaItem): string {
  const src = escapeHtml(resolveMediaPath(item.url));
  const alt = escapeHtml(item.caption ?? "");
  if (isVideoMedia(item)) {
    const poster = item.poster ? ` poster="${escapeHtml(resolveMediaPath(item.poster))}"` : "";
    return `<video src="${src}"${poster} muted playsinline preload="metadata"></video><span class="gm-thumb-play">▶</span>`;
  }
  return `<img src="${src}" alt="${alt}" loading="lazy">`;
}

/** Swaps the viewer between its `<img>` and `<video>` for the given entry. */
export function showMainMedia(
  img: HTMLImageElement,
  video: HTMLVideoElement | null,
  item: MediaItem | undefined,
  note: HTMLElement | null,
): void {
  if (!item) return;
  const src = resolveMediaPath(item.url);
  if (note) note.style.display = "none";
  video?.pause();

  if (video && isVideoMedia(item)) {
    img.style.display = "none";
    img.removeAttribute("src");
    video.style.display = "block";
    if (item.poster) video.poster = resolveMediaPath(item.poster);
    else video.removeAttribute("poster");
    if (video.getAttribute("src") !== src) {
      video.setAttribute("src", src);
      video.load();
    }
    return;
  }

  if (video) {
    video.style.display = "none";
    video.removeAttribute("src");
    video.removeAttribute("poster");
    video.load();
  }
  img.style.display = "block";
  img.src = src;
  img.alt = item.caption ?? "";
}

/** Shown when the browser refuses the container/codec (e.g. .mov in Firefox). */
export function initVideoFallback(video: HTMLVideoElement | null, note: HTMLElement | null): void {
  if (!video || !note) return;
  video.addEventListener("error", () => {
    if (!video.getAttribute("src")) return;
    video.style.display = "none";
    note.style.display = "flex";
  });
}
