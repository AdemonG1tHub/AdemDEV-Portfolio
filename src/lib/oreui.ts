/**
 * OreUI (https://katorly.dev/OreUI) — the component library behind the site's
 * header, buttons, modals, toggles and tags.
 *
 * Importing this module once per page loads the library stylesheet and the
 * small controllers that give `dialog.ore-modal`, `.ore-toggles` and
 * `.ore-tab-button` their behaviour. Everything else in OreUI is plain CSS on
 * native elements, so the rest of the site only needs the right classes.
 *
 * The library's rules live in `@layer components`, and unlayered CSS always
 * beats layered CSS — so site styles that share an element with an `.ore-*`
 * class win outright. Keep site rules on OreUI elements to layout (width,
 * margins, placement) and recolour through the `--ore-*` variables instead.
 */
import "oreui-web/styles.css";
import "oreui-web/modal";
import "oreui-web/tab-button";
import "oreui-web/toggles";

import type { LinkColor } from "@/types/site";
import { escapeHtml } from "./dom";

/* ------------------------------- buttons --------------------------------- */

/**
 * Config link colours predate OreUI, so they're translated here rather than
 * renamed in every config. `undefined` is OreUI's default (primary green);
 * `blue` and `neutral` are site additions defined in tokens.css with the same
 * `--ore-button-*` variables the library's own colours use.
 */
const BUTTON_COLORS: Record<LinkColor, string | undefined> = {
  green: undefined,
  white: "secondary",
  gold: "gold",
  red: "destructive",
  blue: "blue",
  dark: "neutral",
};

/** Sets (or clears) `data-color` on an `.ore-button` for a config colour. */
export function setButtonColor(node: HTMLElement, color: LinkColor): void {
  const value = BUTTON_COLORS[color];
  if (value) node.dataset["color"] = value;
  else delete node.dataset["color"];
}

/** The `data-color` attribute for a config colour, for template strings. */
export function buttonColorAttr(color: LinkColor): string {
  const value = BUTTON_COLORS[color];
  return value ? ` data-color="${value}"` : "";
}

/**
 * A config `textColor` overrides the label colour through the library's own
 * variable, so hover/pressed/disabled states keep working.
 */
export function setButtonTextColor(node: HTMLElement, textColor: string): void {
  if (textColor) node.style.setProperty("--ore-button-foreground", textColor);
}

/* -------------------------------- icons ---------------------------------- */

/**
 * OreUI's 8×8 pixel icons (oreui-web/icons/*.svg), inlined so they inherit
 * `currentColor`. `menu` isn't in the library; it's drawn on the same grid.
 */
const ICON_PATHS = {
  cross:
    "M.5.5h1v1h.966v1h-1v-1H.5zm7 1h-1v-1h1zm-2 1v-1h1v1zm-1 1h1v-1h-1zm0 1v-1h-1v-1h-1v1h1v1h-1v1h-1v1h-1v1h1v-1h1v-1h1v-1zm0 0h1v1h-1zm1.034 2H6.5v1h1v-1h-.966v-1h-1z",
  "chevron-left":
    "M5 2h1V1H5zm0 0v1H4V2zm1 6H5V7h-.966V6h1v1H6zM3 4h1V3H3zm0 1V4H2v1zm0 0h1v1H3z",
  "chevron-right":
    "M3 7H2v1h1zm0 0V6h1v1zM2 1h1v1h.966v1h-1V2H2zm3 4H4v1h1zm0-1v1h1V4zm0 0H4V3h1z",
  menu: "M1 1.5h6v1H1zm0 2h6v1H1zm0 2h6v1H1z",
} as const;

export type OreIconName = keyof typeof ICON_PATHS;

/** Chevrons are drawn half a pixel low in the source SVGs; this matches them. */
const ICON_TRANSFORM: Partial<Record<OreIconName, string>> = {
  "chevron-left": "translate(0 -.5)",
  "chevron-right": "translate(0 -.5)",
};

export function oreIcon(name: OreIconName): string {
  const transform = ICON_TRANSFORM[name];
  return `<ore-icon aria-hidden="true"><svg viewBox="0 0 8 8"><path fill="currentColor" fill-rule="evenodd" d="${ICON_PATHS[name]}"${transform ? ` transform="${transform}"` : ""}/></svg></ore-icon>`;
}

/* --------------------------------- tags ---------------------------------- */

export function oreTagHtml(text: string, variant?: string): string {
  return `<span class="ore-tag"${variant ? ` data-variant="${escapeHtml(variant)}"` : ""}>${escapeHtml(text)}</span>`;
}

/** Fills every `[data-ore-icon]` placeholder in static page markup. */
export function hydrateIcons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-ore-icon]").forEach((node) => {
    const name = node.dataset["oreIcon"] as OreIconName | undefined;
    if (name && name in ICON_PATHS) node.insertAdjacentHTML("afterbegin", oreIcon(name));
    delete node.dataset["oreIcon"];
  });
}
