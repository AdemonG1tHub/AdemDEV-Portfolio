/**
 * Shared helpers for the Ore UI layout experiments (/ore/*).
 * Everything here is data → HTML; each variant decides the layout.
 */
import "@/lib/oreui"; // OreUI stylesheet + modal/tab/toggle controllers
import "./ore.css";

import { SITE } from "@/config/site.config";
import { resolveLinkColor } from "@/lib/colors";
import { escapeHtml } from "@/lib/dom";
import { iconHtml } from "@/lib/icon";
import { buttonColorAttr, hydrateIcons } from "@/lib/oreui";
import { toSlug } from "@/lib/slug";
import type { Project } from "@/types/site";

export { SITE, escapeHtml, hydrateIcons };

export const STATUS = {
  active: { label: "Active", variant: "primary" },
  wip: { label: "In development", variant: "warning" },
  archived: { label: "Archived", variant: "secondary" },
} as const;

export interface Entry {
  p: Project;
  slug: string;
  status: keyof typeof STATUS;
}

export const entries: Entry[] = SITE.projects.map((p) => ({
  p,
  slug: toSlug(p.slug ?? p.title),
  status: p.status ?? "active",
}));

export const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
export const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

export function tagHtml(text: string, variant?: string): string {
  return `<span class="ore-tag"${variant ? ` data-variant="${variant}"` : ""}>${escapeHtml(text)}</span>`;
}

export function statusTag(status: keyof typeof STATUS): string {
  return tagHtml(STATUS[status].label, STATUS[status].variant);
}

export function tagsHtml(tags: string[] | undefined, cls = "chips"): string {
  return tags?.length ? `<div class="${cls}">${tags.map((t) => tagHtml(t)).join("")}</div>` : "";
}

export function coverHtml({ p }: Entry): string {
  return p.cover
    ? `<img src="${escapeHtml(p.cover)}" alt="" loading="lazy" />`
    : `<div class="cover-fallback" style="background:${escapeHtml(p.color ?? "#3a3a3c")}">${p.icon ? iconHtml(p.icon, "cover-icon") : ""}</div>`;
}

export function linkButtons(p: Project, hero = false): string {
  return (p.links ?? [])
    .map((l) => {
      const color = resolveLinkColor(l.color, SITE.defaults.linkColor);
      const ext = /^https?:/i.test(l.url) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a class="ore-button"${hero ? ' data-variant="hero"' : ""}${buttonColorAttr(color)} href="${escapeHtml(l.url)}"${ext}>${escapeHtml(l.label)}</a>`;
    })
    .join("");
}

export const DISCORD = SITE.storeHiddenCta?.url ?? "https://discord.gg/CN4U5kkfTm";

/** Footer shared by all variants: back to the chooser. */

/** Minimal tablist: marks the clicked tab selected and reports its id. */
export function tablist(root: HTMLElement, onChange: (id: string) => void): void {
  const tabs = $$<HTMLButtonElement>('[role="tab"]', root);
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      onChange(tab.dataset["tab"] ?? tab.id);
    }),
  );
}

export function mount(html: string, bodyClass: string): HTMLElement {
  document.body.classList.add("ore-page", bodyClass);
  const app = document.getElementById("app")!;
  app.innerHTML = html;
  hydrateIcons(app);
  return app;
}
