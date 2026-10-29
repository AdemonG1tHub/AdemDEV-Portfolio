import type { Project } from "@/types/site";

/** Slug helpers shared by the runtime router and the build-time embed pages. */

export function toSlug(input: unknown): string {
  const slug = String(input ?? "")
    .trim()
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

export function getUniqueSlug(seed: unknown, used: Set<string>): string {
  const base = toSlug(seed);
  let out = base;
  let n = 2;
  while (used.has(out.toLowerCase())) {
    out = `${base}-${n}`;
    n += 1;
  }
  used.add(out.toLowerCase());
  return out;
}

/** Project slugs in config order. Projects are slugged first, so these match the router's. */
export function projectSlugs(projects: Project[], used = new Set<string>()): string[] {
  return projects.map((p) => getUniqueSlug(p.slug ?? p.title, used));
}
