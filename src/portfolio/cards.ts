import { SITE } from "@/config/site.config";
import { resolveLinkColor, resolveTextColor } from "@/lib/colors";
import { byId, escapeHtml } from "@/lib/dom";
import { iconHtml } from "@/lib/icon";
import { isVideoMedia, resolveMediaPath } from "@/lib/media";
import type { LinkButton, MediaItem, Project, StoreItem } from "@/types/site";

export type CardKind = "projects" | "selling";

function linkButtonsHtml(links: LinkButton[] | undefined): string {
  return (links ?? [])
    .map((link) => {
      const color = resolveLinkColor(link.color, SITE.defaults.linkColor);
      const textColor = resolveTextColor(link.textColor);
      const style = textColor ? ` style="color:${escapeHtml(textColor)}"` : "";
      const external = /^https?:/i.test(link.url) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a class="card-btn ${color}"${style} href="${escapeHtml(link.url)}"${external} data-stop-card>${escapeHtml(link.label)}</a>`;
    })
    .join("");
}

function mediaHint(media: MediaItem[], kind: CardKind): string {
  if (media.length === 0) return kind === "projects" ? "CLICK TO VIEW" : "NO IMAGES";
  const videoCount = media.filter(isVideoMedia).length;
  const noun = videoCount === 0 ? "IMAGE" : videoCount === media.length ? "VIDEO" : "ITEM";
  return `${media.length} ${noun}${media.length === 1 ? "" : "S"}`;
}

function statusPillClass(status: string | undefined): string {
  if (status === "wip") return "pill-wip";
  if (status === "active") return "pill-active";
  return "pill-archived";
}

/**
 * Renders the project / store grids. Both share the card markup; the only
 * differences are the chip label, the description line, and which modal opens.
 */
export function renderCards(
  items: readonly (Project | StoreItem)[],
  kind: CardKind,
  onOpen: (index: number) => void,
): void {
  const container = byId(kind === "projects" ? "cards-grid" : "selling-grid");
  if (!container) return;

  const cardLabel = kind === "selling" ? SITE.labels.sellingCardLabel : SITE.labels.projectCardLabel;

  items.forEach((item, index) => {
    const media = ("gallery" in item ? item.gallery : undefined) ?? ("images" in item ? item.images : undefined) ?? [];

    // A video can't be a CSS background — fall back to the first still image.
    const firstStill = media.find((m) => !isVideoMedia(m));
    const firstPoster = media.find((m) => isVideoMedia(m) && m.poster);
    const coverSrc = resolveMediaPath(item.cover ?? firstStill?.url ?? firstPoster?.poster);

    const coverHtml = coverSrc
      ? `<div class="card-cover" style="background-image:url('${escapeHtml(coverSrc)}')"></div>`
      : `<div class="card-cover is-placeholder">${iconHtml(item.icon ?? "📦", "card-cover-icon")}</div>`;

    const description =
      kind === "selling"
        ? `${"price" in item && item.price ? `<strong>${escapeHtml(item.price)}</strong><span class="card-sep"> — </span>` : ""}${escapeHtml(("short" in item && item.short) || "")}`
        : escapeHtml(("desc" in item && item.desc) || "");

    const links = linkButtonsHtml(item.links);
    const tags = (item.tags ?? []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const status = "status" in item ? item.status : undefined;

    const card = document.createElement("div");
    card.className = "card reveal";
    card.style.transitionDelay = `${index * 0.06}s`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <div class="card-accent" style="background:${escapeHtml(item.color ?? "#666")}"></div>
      <div class="card-inner">
        ${coverHtml}
        <div class="card-chip-row"><span class="card-chip">${escapeHtml(cardLabel)}</span></div>
        <div class="card-title-row">
          <div class="card-title">${escapeHtml(item.title)}</div>
          ${iconHtml(item.icon, "card-title-icon")}
        </div>
        <p class="card-desc">${description}</p>
        <div class="card-links${links ? "" : " is-empty"}">${links}</div>
        <div class="card-tags">${tags}</div>
        <div class="card-gallery-hint">
          <div class="gallery-hint-dot"></div>
          <span class="gallery-hint-text">${escapeHtml(mediaHint(media, kind))}</span>
          ${status ? `<span class="status-pill ${statusPillClass(status)}">${escapeHtml(status)}</span>` : ""}
        </div>
      </div>`;

    // Link buttons inside the card open their own URL rather than the modal.
    card.querySelectorAll("[data-stop-card]").forEach((link) => {
      link.addEventListener("click", (event) => event.stopPropagation());
    });

    card.addEventListener("click", () => onOpen(index));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onOpen(index);
    });

    container.append(card);
  });
}
