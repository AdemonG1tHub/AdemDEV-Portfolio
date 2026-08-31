import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/** Renders markdown to HTML with the site's shared options. */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
}

/**
 * Strips the common leading indentation from a block so markdown written inside
 * an indented config literal doesn't render as a code block.
 */
export function normalizeIndent(md: string): string {
  if (!md) return md;
  const lines = md.split("\n");
  while (lines.length > 0 && lines[0]?.trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1]?.trim() === "") lines.pop();
  if (lines.length === 0) return "";

  const indents = lines.map((line) => (line.trim() === "" ? 0 : (line.match(/^\s*/)?.[0].length ?? 0)));
  const minIndent = Math.min(...indents);
  if (!minIndent) return lines.join("\n");
  return lines.map((line) => (line.length >= minIndent ? line.slice(minIndent) : "")).join("\n");
}

/** Rewrites a GitHub `blob` URL to its `raw.githubusercontent.com` equivalent. */
export function normalizeGithubUrl(url: string): string {
  if (!url) return "";
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i);
  if (!match) return url;
  const [, owner, repo, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${path}`;
}

/**
 * Resolves a `md` config field, which is either inline markdown or a path to a
 * `.md` file. Returns the raw field unchanged when it isn't a path.
 */
export async function fetchMarkdown(field: string | undefined): Promise<string> {
  if (!field) return "";
  const trimmed = field.trim();
  const looksLikePath = /\.md(\?.*)?$/i.test(trimmed) && !trimmed.includes("\n");
  if (!looksLikePath) return field;

  const candidates = new Set<string>();
  if (/^(https?:|file:)/i.test(trimmed)) candidates.add(trimmed);
  try {
    candidates.add(new URL(trimmed, window.location.href).toString());
  } catch {
    /* not resolvable against the page URL */
  }
  candidates.add(trimmed);
  if (!trimmed.startsWith("./") && !trimmed.startsWith("/")) {
    candidates.add(`/${trimmed}`);
  }

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, { cache: "no-store" });
      if (res.ok) return await res.text();
    } catch {
      /* try the next candidate */
    }
  }
  return "";
}
