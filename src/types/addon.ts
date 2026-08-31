/**
 * Shapes for an add-on page: the feature catalogue and the live menu viewer.
 *
 * One renderer (`src/addon/`) drives every add-on page; each add-on supplies a
 * config under `src/config/addons/`. Adding a page means adding a config, an
 * HTML entry and a Vite input — no renderer changes.
 *
 * The viewer is a faithful CSS/DOM recreation of the add-on's in-game UI, so
 * these types mirror the three form kinds `@minecraft/server-ui` exposes:
 *
 *   ActionFormData  -> "action-grid" (tiled, main-menu style) and "action-list"
 *   ChestFormData   -> "chest"
 *   ModalFormData   -> "modal"
 *
 * All label/body strings accept Minecraft `§` formatting codes and are parsed
 * by `src/lib/mcText.ts`, so text can be pasted straight out of the add-on
 * source and will render with the same colours.
 */

import type { LinkButton, LinkColor } from "./site";

export type MenuId = string;

/* ------------------------------- menu buttons ------------------------------ */

export interface MenuButton {
  /** Supports `§` codes, e.g. "§cAdmin Page". */
  label: string;
  /** Icon path, e.g. "/gilded/icons/castle.png". */
  icon?: string;
  /** Menu this button opens. Omit for a button that only shows `note`. */
  opens?: MenuId;
  /** Chat-style feedback shown when the button has no target menu. */
  note?: string;
  /** Renders the button greyed out and unclickable. */
  disabled?: boolean;
}

/* -------------------------------- chest UI -------------------------------- */

export interface ChestItem {
  /** 0-based slot index; 9 slots per row. */
  slot: number;
  /** Item name shown on the first tooltip line. Supports `§` codes. */
  name: string;
  /** Tooltip lore lines under the name. Supports `§` codes. */
  lore?: string[];
  /** Icon path. Falls back to `glyph`, then to a generic item block. */
  icon?: string;
  /** Emoji/text stand-in when no icon texture is available. */
  glyph?: string;
  /** Stack count badge, 1-99. Hidden when 1 or unset. */
  stack?: number;
  /** Draws the enchantment shimmer over the icon. */
  enchanted?: boolean;
  opens?: MenuId;
  note?: string;
}

/* -------------------------------- modal UI -------------------------------- */

export type ModalField =
  | { type: "textField"; label: string; placeholder?: string; value?: string }
  | { type: "toggle"; label: string; value?: boolean }
  | { type: "slider"; label: string; min: number; max: number; step?: number; value?: number }
  | { type: "dropdown"; label: string; options: string[]; index?: number };

/* --------------------------------- menus ---------------------------------- */

interface MenuBase {
  id: MenuId;
  /** Right-hand title in the orange header strip. Supports `§` codes. */
  title: string;
  /**
   * Plain label for the viewer's quick-jump chips. Worth setting when `title`
   * is a `§`-coloured wordmark or a page counter, which reads badly as a chip.
   * Defaults to `title` with codes and placeholders resolved.
   */
  navLabel?: string;
  /** Where the window's ✕ and the viewer's back arrow go. Root menu if unset. */
  back?: MenuId;
}

/** ActionFormData rendered as tiles — the main menu layout. */
export interface ActionGridMenu extends MenuBase {
  kind: "action-grid";
  body?: string;
  /** Tiles per row. Defaults to 3, matching the in-game grid. */
  columns?: number;
  buttons: MenuButton[];
}

/** ActionFormData rendered as full-width rows with an icon to the left. */
export interface ActionListMenu extends MenuBase {
  kind: "action-list";
  body?: string;
  buttons: MenuButton[];
}

/** ChestFormData — a container UI with hover tooltips. */
export interface ChestMenu extends MenuBase {
  kind: "chest";
  /** Slot count. 9 per row, so 54 is the "double" chest. */
  size: 9 | 18 | 27 | 36 | 45 | 54;
  /** Title lines drawn above the grid. Supports `§` codes. */
  titleLines?: string[];
  items: ChestItem[];
}

/** ModalFormData — labelled inputs plus a submit button. */
export interface ModalMenu extends MenuBase {
  kind: "modal";
  fields: ModalField[];
  submitLabel?: string;
  /** Menu opened after submitting. Defaults to `back`. */
  submits?: MenuId;
  /** Chat-style feedback shown on submit. */
  note?: string;
}

export type AddonMenu = ActionGridMenu | ActionListMenu | ChestMenu | ModalMenu;

/**
 * Window chrome for the live viewer.
 *
 *   "gilded"  blue/orange split header over a salmon frame, vanilla grey chest
 *   "chest"   chest-only add-ons — every menu is a container UI, so there is no
 *             Action-form frame to draw
 */
export type MenuSkin = "gilded" | "chest";

/** Chest-UI textures, so each add-on's own container skin can be used. */
export interface ChestSkin {
  /** Nine-sliced slot texture (18x18, slice 1). */
  slot: string;
  /** Panel fill behind the slots. */
  panel: string;
  /** Panel border colour. */
  border: string;
  /** Title text colour on the panel. */
  title: string;
  /** Colour of the close glyph. */
  close: string;
}

export interface MenuViewerConfig {
  /** Left-hand text in the blue header strip. */
  headerText: string;
  /** Menu shown on load and after pressing ✕. */
  rootMenu: MenuId;
  /** Name substituted for `{player}` in any menu text. */
  playerName: string;
  /** Which window chrome the Action/Modal forms wear. Defaults to "gilded". */
  skin?: MenuSkin;
  /**
   * Name substituted for `{server}`. In the add-on this is whatever the admin
   * types into the setup wizard, so it appears in the main menu title and the
   * welcome line rather than being hard-coded.
   */
  serverName: string;
  /** Chest textures/colours. Defaults to the vanilla grey chest. */
  chest?: ChestSkin;
  menus: Record<MenuId, AddonMenu>;
}

/* -------------------------------- features -------------------------------- */

export interface FeatureStep {
  /** Short imperative heading, e.g. "Open the menu". */
  title: string;
  /** Body text for the step. */
  text: string;
  /** Optional command or snippet rendered in a code chip. */
  code?: string;
}

export interface Feature {
  id: string;
  name: string;
  /** Emoji, or an image path, shown on the feature tile. */
  icon: string;
  /** One-line summary for the tile. */
  summary: string;
  tags?: string[];
  /** Marks the feature as not-yet-shipped. */
  status?: "stable" | "beta" | "planned";
  /** Longer intro paragraph in the detail panel. */
  overview: string;
  /** The "how to use it" walkthrough. */
  steps: FeatureStep[];
  /** Slash commands this feature adds. */
  commands?: { command: string; desc: string; permission?: string }[];
  /** Tags/permissions required. */
  requires?: string[];
  /** Admin-configurable options this feature exposes. */
  options?: { name: string; desc: string }[];
  /** Jumps the live viewer to this menu id. */
  demoMenu?: MenuId;
}

/* ------------------------------- page config ------------------------------ */

/** Accent palette. Applied to CSS custom properties at page load. */
export interface AddonTheme {
  accent: string;
  accentBright: string;
  accentSoft: string;
  accentLight: string;
  accentDeep: string;
  accentLine: string;
  accentInk: string;
  accentLink: string;
  /** Page surfaces, so a page can sit warm or cool. */
  surface: string;
  surfaceAlt: string;
  surfaceDark: string;
  surfaceCard: string;
  line: string;
  lineSoft: string;
  /** `<meta name="theme-color">` and the hero badge. */
  themeColor: string;
}

export interface AddonPageConfig {
  /** Page + document title. */
  name: string;
  /** URL slug, used for the canonical link. */
  slug: string;
  /** Accent palette applied to CSS custom properties at load. */
  theme: AddonTheme;
  tagline: string;
  subtitle: string;
  version: string;
  minEngineVersion: string;
  /** Hero background texture under `public/`. */
  heroBackground: string;
  /** Buttons in the hero. */
  heroLinks: LinkButton[];
  /** Buttons in the download band. Toggle these to pick a distribution route. */
  download: {
    heading: string;
    note: string;
    fileName: string;
    buttons: LinkButton[];
  };
  stats: { num: string; label: string }[];
  /**
   * Button skin for the "Open this in the live menu" link. The `card-btn`
   * skins are fixed textures, so pick the one nearest the theme accent.
   */
  demoButtonColor?: LinkColor;
  features: Feature[];
  viewer: MenuViewerConfig;
  footer: { tagLine: string };
}
