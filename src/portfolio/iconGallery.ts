import { el, requireId } from "@/lib/dom";
import { setButtonColor } from "@/lib/oreui";
import type { MediaItem } from "@/types/site";

/**
 * Asset-pack view for a project's gallery (`layout: "icons"`): one large,
 * pixel-crisp preview with a download button, over a grid of every icon.
 */

export interface IconGallery {
  load(items: MediaItem[]): void;
  step(delta: number): void;
}

const fileName = (item: MediaItem): string => {
  const base = (item.caption ?? "icon").trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${base || "icon"}.png`;
};

/**
 * The most common colour in the image, ignoring transparent pixels and the dark
 * or grey ones (outlines, shadows, highlights) so a badge reads as its body colour.
 * Returns null when nothing qualifies or the pixels can't be read.
 */
function dominantColor(img: HTMLImageElement): string | null {
  try {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (a < 200 || max < 70 || (max - min) / max < 0.3) continue;
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      bucket.n += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      buckets.set(key, bucket);
    }

    let best: { n: number; r: number; g: number; b: number } | null = null;
    for (const bucket of buckets.values()) if (!best || bucket.n > best.n) best = bucket;
    if (!best) return null;
    return `rgb(${Math.round(best.r / best.n)} ${Math.round(best.g / best.n)} ${Math.round(best.b / best.n)})`;
  } catch {
    return null; // tainted canvas (cross-origin icon)
  }
}

export function createIconGallery(): IconGallery {
  const img = requireId<HTMLImageElement>("ig-img");
  const nameEl = requireId("ig-name");
  const countEl = requireId("ig-count");
  const sizeEl = requireId("ig-size");
  const grid = requireId("ig-grid");
  const download = requireId<HTMLAnchorElement>("ig-download");
  const prev = requireId<HTMLButtonElement>("ig-prev");
  const next = requireId<HTMLButtonElement>("ig-next");

  setButtonColor(download, "primary");

  let items: MediaItem[] = [];
  let index = 0;

  const stage = requireId("ig-stage");

  img.addEventListener("load", () => {
    const glow = dominantColor(img);
    if (glow) stage.style.setProperty("--ig-glow", glow);
    else stage.style.removeProperty("--ig-glow");
    sizeEl.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;
  });

  function select(to: number): void {
    if (items.length === 0) return;
    index = Math.max(0, Math.min(to, items.length - 1));
    const item = items[index]!;

    img.classList.remove("pop");
    void img.offsetWidth; // restart the pop animation
    img.classList.add("pop");
    img.src = item.url;
    img.alt = item.caption ?? "";

    nameEl.textContent = item.caption ?? `Icon ${index + 1}`;
    countEl.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    download.href = item.url;
    download.download = fileName(item);
    prev.disabled = index === 0;
    next.disabled = index === items.length - 1;

    grid.querySelectorAll<HTMLElement>(".ig-tile").forEach((tile, i) => {
      const active = i === index;
      tile.classList.toggle("active", active);
      tile.setAttribute("aria-selected", String(active));
    });
  }

  prev.addEventListener("click", () => select(index - 1));
  next.addEventListener("click", () => select(index + 1));

  return {
    load(list) {
      items = list;
      grid.replaceChildren(
        ...items.map((item, i) => {
          const tile = el("button", { className: "ig-tile", attrs: { type: "button", role: "option", title: item.caption ?? "" } }, [
            el("img", { attrs: { src: item.url, alt: "", loading: "lazy" } }),
            el("span", { className: "ig-tile-label", text: item.caption ?? `Icon ${i + 1}` }),
          ]);
          tile.addEventListener("click", () => select(i));
          return tile;
        }),
      );
      select(0);
    },
    step: (delta) => select(index + delta),
  };
}
