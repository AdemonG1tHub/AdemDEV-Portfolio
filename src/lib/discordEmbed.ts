import type { SiteConfig } from "@/types/site";

/**
 * Builds the Discord "component embed" (Components V2) for the link preview.
 * https://docs.discord.com/developers/link-previews/component-embeds
 *
 * The result is derived from `SITE.projects`, so reordering or editing projects
 * in site.config.ts updates the embed on the next build. Discord only allows a
 * single top-level Container, no `flags`, and a 3,000-byte payload.
 */

const MAX_BYTES = 3000;

interface Media {
  media: { url: string };
}

export function buildDiscordEmbed(site: SiteConfig): { component: unknown } {
  const cfg = site.discordEmbed;
  const abs = (path: string) => (/^https?:\/\//.test(path) ? path : new URL(path, cfg.siteUrl).href);

  const projects = site.projects.filter((p) => p.status !== "archived");
  const featured = projects.slice(0, cfg.featured);
  const gallery = projects
    .slice(cfg.featured)
    .filter((p) => p.cover)
    .slice(0, Math.min(cfg.gallery, 10)); // Discord caps gallery items at 10

  const sections = featured.map((p) => ({
    type: 9,
    components: [{ type: 10, content: `### __${p.title}__${p.desc ? `\n> ${p.desc}` : ""}` }],
    ...(p.cover && { accessory: { type: 11, media: { url: abs(p.cover) } } }),
  }));

  const items: Media[] = gallery.map((p) => ({ media: { url: abs(p.cover!) } }));

  const payload = {
    component: {
      type: 17,
      components: [
        { type: 10, content: `## ${cfg.title ?? `${site.name} Portfolio`}` },
        { type: 14, divider: true, spacing: 1 },
        ...sections,
        ...(items.length ? [{ type: 14, divider: true, spacing: 2 }, { type: 12, items }] : []),
      ],
    },
  };

  const bytes = new TextEncoder().encode(JSON.stringify(payload)).length;
  if (bytes > MAX_BYTES) {
    throw new Error(
      `Discord component embed is ${bytes} bytes (limit ${MAX_BYTES}). ` +
        `Shorten project descriptions or lower discordEmbed.gallery.`,
    );
  }
  return payload;
}
