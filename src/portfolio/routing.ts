import { SITE } from "@/config/site.config";

/**
 * Hash routing for the detail modals: `#/astralcraft-engine` deep-links to a
 * project or store item. Legacy `?detail=` and `/slug` paths are accepted on
 * first load and rewritten to the hash form.
 */

interface RouteState {
  syncing: boolean;
  projectSlugs: string[];
  sellingSlugs: string[];
}

export const routeState: RouteState = {
  syncing: false,
  projectSlugs: [],
  sellingSlugs: [],
};

export function toSlug(input: unknown): string {
  const slug = String(input ?? "")
    .trim()
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function getUniqueSlug(seed: unknown, used: Set<string>): string {
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

function rebuildSlugs(): void {
  const used = new Set<string>();
  routeState.projectSlugs = SITE.projects.map((p) => getUniqueSlug(p.slug ?? p.title, used));
  routeState.sellingSlugs = SITE.currentlySelling.map((p) => getUniqueSlug(p.slug ?? p.id ?? p.title, used));
}

function buildDetailPath(slug: string): string {
  return `#/${encodeURIComponent(slug)}`;
}

export function setDetailPath(slug: string, replace = false): void {
  const target = buildDetailPath(slug);
  if (window.location.hash === target) return;
  if (replace) {
    window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}${target}`);
    return;
  }
  window.location.hash = target;
}

export function clearDetailPath(replace = false): void {
  if (!window.location.hash) return;
  const bare = `${window.location.pathname}${window.location.search}`;
  if (replace) window.history.replaceState({}, "", bare);
  else window.history.pushState({}, "", bare);
}

/** Handlers registered by the modals so routing stays decoupled from them. */
export interface DetailHandlers {
  openProject(index: number, options?: { skipRouteUpdate?: boolean }): void;
  openSelling(index: number, options?: { skipRouteUpdate?: boolean }): void;
  closeAll(): void;
}

let handlers: DetailHandlers | null = null;

function readRequestedSlug(): string {
  const params = new URLSearchParams(window.location.search);
  const queryDetail = (params.get("detail") ?? "").trim();

  const rawHash = window.location.hash.replace(/^#/, "").trim();
  const hashDetail = rawHash.startsWith("/") ? rawHash.slice(1) : "";

  const cleanedPath = (window.location.pathname || "/").replace(/\/+$/, "");
  const segment = cleanedPath.split("/").pop() ?? "";
  const fromPath = segment && !/^index\.html$/i.test(segment) ? segment : "";

  try {
    return decodeURIComponent(queryDetail || hashDetail || fromPath).toLowerCase();
  } catch {
    return "";
  }
}

function openFromPath(): void {
  if (!handlers) return;
  const requested = readRequestedSlug();
  if (!requested) {
    handlers.closeAll();
    return;
  }

  const projectIdx = routeState.projectSlugs.findIndex((s) => s.toLowerCase() === requested);
  if (projectIdx >= 0) {
    handlers.closeAll();
    handlers.openProject(projectIdx, { skipRouteUpdate: true });
    setDetailPath(routeState.projectSlugs[projectIdx]!, true);
    return;
  }

  const sellingIdx = routeState.sellingSlugs.findIndex((s) => s.toLowerCase() === requested);
  if (SITE.featureFlags.showStoreSection && sellingIdx >= 0) {
    handlers.closeAll();
    handlers.openSelling(sellingIdx, { skipRouteUpdate: true });
    setDetailPath(routeState.sellingSlugs[sellingIdx]!, true);
    return;
  }

  handlers.closeAll();
  clearDetailPath(true);
}

export function initDetailRouting(detailHandlers: DetailHandlers): void {
  handlers = detailHandlers;
  rebuildSlugs();

  window.addEventListener("hashchange", () => {
    routeState.syncing = true;
    try {
      openFromPath();
    } finally {
      routeState.syncing = false;
    }
  });

  routeState.syncing = true;
  try {
    openFromPath();
  } finally {
    routeState.syncing = false;
  }
}
