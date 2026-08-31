import { escapeHtml } from "@/lib/dom";
import { fetchMarkdown, normalizeIndent, renderMarkdown } from "@/lib/markdown";

/**
 * Renders a config `md` field into an element. Shared by the project and store
 * modals so both resolve inline markdown and `.md` paths the same way, and
 * report a failed fetch instead of silently showing nothing.
 *
 * Each call is tagged so a slow fetch for a modal the user has already closed
 * can't overwrite the content of the one they opened next.
 */

const tokens = new WeakMap<HTMLElement, number>();

export async function renderMarkdownInto(target: HTMLElement, field: string | undefined): Promise<void> {
  const token = (tokens.get(target) ?? 0) + 1;
  tokens.set(target, token);

  const raw = field ?? "";
  if (!raw.trim()) {
    target.innerHTML = renderMarkdown("*No description provided.*");
    return;
  }

  target.textContent = "Loading…";

  const fetched = await fetchMarkdown(raw);
  if (tokens.get(target) !== token) return; // a newer render won

  const md = normalizeIndent(fetched || (raw.includes("\n") ? raw : ""));

  if (!md && /\.md$/i.test(raw.trim())) {
    target.innerHTML = `<div class="gm-placeholder-sub">Description unavailable — failed to load <strong>${escapeHtml(raw)}</strong>.</div>`;
    return;
  }

  target.innerHTML = renderMarkdown(md || "*No description provided.*");
  target.scrollTop = 0;
}
