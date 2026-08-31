import type { LinkColor } from "@/types/site";

const ALLOWED_LINK_COLORS = new Set<LinkColor>(["green", "white", "blue", "gold", "dark", "red"]);

/** Falls back to `fallback` for unset or unrecognised colours. */
export function resolveLinkColor(color: string | undefined, fallback: LinkColor = "gold"): LinkColor {
  if (!color) return fallback;
  return ALLOWED_LINK_COLORS.has(color as LinkColor) ? (color as LinkColor) : fallback;
}

const CSS_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|[a-zA-Z]+|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/;

/** Accepts hex, rgb()/hsl() and named colours; anything else is dropped. */
export function resolveTextColor(color: unknown): string {
  if (typeof color !== "string") return "";
  const value = color.trim();
  return CSS_COLOR_RE.test(value) ? value : "";
}
