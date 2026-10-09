import type { LinkColor } from "@/types/site";

// A record rather than a list so adding a colour to `LinkColor` without
// listing it here is a type error.
const LINK_COLORS: Record<LinkColor, true> = {
  primary: true,
  secondary: true,
  destructive: true,
  gold: true,
  dungeons: true,
  legends: true,
  realms: true,
  blue: true,
  neutral: true,
};

/** Falls back to `fallback` for unset or unrecognised colours. */
export function resolveLinkColor(color: string | undefined, fallback: LinkColor = "gold"): LinkColor {
  if (!color) return fallback;
  return Object.hasOwn(LINK_COLORS, color) ? (color as LinkColor) : fallback;
}

const CSS_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|[a-zA-Z]+|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/;

/** Accepts hex, rgb()/hsl() and named colours; anything else is dropped. */
export function resolveTextColor(color: unknown): string {
  if (typeof color !== "string") return "";
  const value = color.trim();
  return CSS_COLOR_RE.test(value) ? value : "";
}
