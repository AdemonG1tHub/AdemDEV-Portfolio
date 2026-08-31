import { escapeHtml } from "./dom";

/**
 * Config `icon` fields accept either an emoji or an image.
 *
 * Anything that looks like a path or URL is rendered as an `<img>`; everything
 * else is treated as text. That covers:
 *
 *   icon: "🪙"                                  emoji
 *   icon: "/images/glyphs/coin.png"             root-relative (under public/)
 *   icon: "images/glyphs/coin.png"              bare relative path
 *   icon: "https://cdn.discordapp.com/…​.webp"   remote, e.g. a custom emoji
 *   icon: "data:image/png;base64,…"             inline
 *
 * Image icons size themselves from the surrounding font-size (`height: 1em`),
 * so the same value works in a card title, a card cover and a modal placeholder
 * without per-site tuning.
 */

const IMAGE_ICON_RE =
  /^(?:https?:\/\/|data:image\/|\.{0,2}\/)|\.(?:png|jpe?g|gif|webp|svg|avif)(?:[?#].*)?$/i;

export function isImageIcon(icon: string | undefined): boolean {
  if (!icon) return false;
  const value = icon.trim();
  if (!value) return false;
  return IMAGE_ICON_RE.test(value);
}

/** Markup for an icon, for use inside a template string. */
export function iconHtml(icon: string | undefined, className: string): string {
  const value = (icon ?? "").trim();
  if (!value) return "";
  if (!isImageIcon(value)) {
    return `<span class="${className}" aria-hidden="true">${escapeHtml(value)}</span>`;
  }
  return `<span class="${className} is-image" aria-hidden="true"><img src="${escapeHtml(value)}" alt="" loading="lazy"></span>`;
}

/** Replaces an existing element's contents with the icon. */
export function setIcon(target: HTMLElement | null, icon: string | undefined, fallback = ""): void {
  if (!target) return;
  const value = (icon ?? "").trim() || fallback;

  target.classList.toggle("is-image", isImageIcon(value));

  if (!isImageIcon(value)) {
    target.textContent = value;
    return;
  }

  const img = document.createElement("img");
  img.src = value;
  img.alt = "";
  img.loading = "lazy";
  target.replaceChildren(img);
}
