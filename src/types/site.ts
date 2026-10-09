/**
 * Shapes for everything rendered on the portfolio page.
 *
 * `src/config/site.config.ts` is checked against these, so a typo in the config
 * is a build error rather than a blank section at runtime.
 */

import type { OreButtonColor } from "oreui-web";

/**
 * Button colours: OreUI's own (`primary` is its default green), plus `blue`
 * and `neutral`, which tokens.css defines with the same `--ore-button-*`
 * variables the library uses.
 */
export type LinkColor = OreButtonColor | "blue" | "neutral";

export type ProjectStatus = "active" | "wip" | "archived";

export interface LinkButton {
  label: string;
  url: string;
  /** Falls back to `defaults.linkColor` when unset or unknown. */
  color?: LinkColor;
  /** Optional CSS colour for the label itself, e.g. "#ffcc00". */
  textColor?: string;
}

export interface MediaItem {
  url: string;
  caption?: string;
  /** Inferred from the file extension when omitted. */
  type?: "image" | "video";
  /** Poster frame for videos. */
  poster?: string;
}

export interface Stat {
  num: string;
  label: string;
}

export interface Project {
  title: string;
  /** Short blurb for the card and the modal. Optional when `md` is provided. */
  desc?: string;
  /**
   * Emoji, or a path/URL to an image — a Minecraft glyph, a custom Discord
   * emoji, anything. Values that look like a path or URL render as an `<img>`;
   * everything else renders as text.
   *   "🪙" | "/images/glyphs/coin.png" | "https://cdn.example.com/emoji.webp"
   */
  icon?: string;
  /**
   * Long-form description shown in the project modal: inline markdown, or a
   * path to a `.md` file under `public/` (e.g. /markdown/astral-engine.md).
   * When set it replaces `desc` in the modal and enables the font switcher.
   */
  md?: string;
  tags?: string[];
  status?: ProjectStatus;
  /** Custom URL slug; defaults to a slugified title. */
  slug?: string;
  /** Accent colour (hex). */
  color?: string;
  /** Card banner, ideally 1000x400. */
  cover?: string;
  links?: LinkButton[];
  gallery?: MediaItem[];
}

export interface StoreItem {
  id: string;
  title: string;
  price?: string;
  short?: string;
  slug?: string;
  icon?: string;
  color?: string;
  cover?: string;
  images?: MediaItem[];
  tags?: string[];
  /** Inline markdown, or a path to a `.md` file under `public/`. */
  md?: string;
  links?: LinkButton[];
}

export interface TeamMember {
  role: string;
  name: string;
  text?: string;
}

export interface Service {
  icon: string;
  name: string;
  desc: string;
}

export interface ProfileMenuConfig {
  enabled?: boolean;
  navLabel?: string;
  title?: string;
  accentColor?: string;
  /** Remote or local markdown; GitHub `blob` URLs are rewritten to `raw`. */
  markdownUrl?: string;
  buttons?: LinkButton[];
}

/**
 * The "Archived Projects" section, filled with every project whose `status`
 * is `"archived"`. With `enabled: false` those projects stay in the main grid.
 */
export interface ArchivedProjectsConfig {
  enabled: boolean;
  label?: string;
  heading?: string;
  /** Small note beside the heading. */
  note?: string;
  navLabel?: string;
}

export interface StoreHiddenCta {
  action: "copy" | "url";
  label?: string;
  copyText?: string;
  url?: string;
}

export interface SiteConfig {
  name: string;
  brandText?: string;
  tagline: string;
  subtitle: string;
  email?: string;
  github?: string;
  discord?: string;
  FOOTER: { tagLine: string };
  defaults: { linkColor: LinkColor };
  stats: Stat[];
  skills: string[];
  projects: Project[];
  archivedProjects: ArchivedProjectsConfig;
  team: { label?: string; heading?: string; members: TeamMember[] };
  services: Service[];
  featureFlags: { showStoreSection: boolean };
  storeHiddenCta?: StoreHiddenCta;
  currentlySelling: StoreItem[];
  profileMenu?: ProfileMenuConfig;
  labels: { sellingCardLabel: string; projectCardLabel: string };
}
