import { el, escapeHtml, qsa } from "@/lib/dom";
import { setIcon } from "@/lib/icon";
import type { Feature } from "@/types/addon";
import type { LinkColor } from "@/types/site";

/**
 * The features section: a grid of tiles on the left, a detail panel on the
 * right. Selecting a tile fills the panel with the full walkthrough for that
 * feature — overview, numbered steps, commands, required tags and options.
 *
 * On narrow screens the panel stacks under the grid and the page scrolls to it,
 * so the interaction still reads as "tap a feature, get the instructions".
 */

export interface FeatureExplorer {
  select(id: string): void;
}

const STATUS_LABEL: Record<NonNullable<Feature["status"]>, string> = {
  stable: "stable",
  beta: "beta",
  planned: "planned",
};

function buildTile(feature: Feature, onSelect: (id: string) => void): HTMLElement {
  const tile = el("button", {
    className: "feature-tile",
    attrs: { type: "button", "data-feature": feature.id, "aria-pressed": "false" },
  });

  // `icon` is an emoji or an image path — an <img> for every value would 404 on
  // the emoji ones.
  const tileIcon = el("span", { className: "feature-tile__icon", attrs: { "aria-hidden": "true" } });
  setIcon(tileIcon, feature.icon);
  tile.append(tileIcon);

  const text = el("span", { className: "feature-tile__text" });
  text.append(el("span", { className: "feature-tile__name", text: feature.name }));
  text.append(el("span", { className: "feature-tile__summary", text: feature.summary }));
  tile.append(text);

  if (feature.status && feature.status !== "stable") {
    tile.append(el("span", { className: `feature-tile__status is-${feature.status}`, text: STATUS_LABEL[feature.status] }));
  }

  tile.addEventListener("click", () => onSelect(feature.id));
  return tile;
}

function buildDetail(
  feature: Feature,
  onDemo: ((menuId: string) => void) | undefined,
  demoColor: LinkColor,
): HTMLElement {
  const panel = el("article", { className: "feature-detail" });

  const head = el("header", { className: "feature-detail__head" });
  const headIcon = el("span", { className: "feature-detail__icon", attrs: { "aria-hidden": "true" } });
  setIcon(headIcon, feature.icon);
  head.append(headIcon);
  const heading = el("div");
  heading.append(el("h3", { className: "feature-detail__name", text: feature.name }));
  if (feature.tags?.length) {
    const tags = el("div", { className: "feature-detail__tags" });
    for (const tag of feature.tags) tags.append(el("span", { className: "tag", text: tag }));
    heading.append(tags);
  }
  head.append(heading);
  panel.append(head);

  panel.append(el("p", { className: "feature-detail__overview", text: feature.overview }));

  // ---- how to use it -------------------------------------------------------
  panel.append(el("h4", { className: "feature-detail__label", text: "How to use it" }));
  const steps = el("ol", { className: "feature-steps" });
  for (const step of feature.steps) {
    const item = el("li", { className: "feature-step" });
    item.append(el("div", { className: "feature-step__title", text: step.title }));
    item.append(el("p", { className: "feature-step__text", text: step.text }));
    if (step.code) item.append(el("code", { className: "feature-step__code", text: step.code }));
    steps.append(item);
  }
  panel.append(steps);

  // ---- commands ------------------------------------------------------------
  if (feature.commands?.length) {
    panel.append(el("h4", { className: "feature-detail__label", text: "Commands" }));
    const table = el("div", { className: "feature-commands" });
    for (const command of feature.commands) {
      const row = el("div", { className: "feature-command" });
      row.append(el("code", { className: "feature-command__name", text: command.command }));
      row.append(el("span", { className: "feature-command__desc", text: command.desc }));
      if (command.permission) {
        row.append(el("span", { className: "feature-command__perm", text: command.permission }));
      }
      table.append(row);
    }
    panel.append(table);
  }

  // ---- requirements --------------------------------------------------------
  if (feature.requires?.length) {
    panel.append(el("h4", { className: "feature-detail__label", text: "Requires" }));
    const list = el("ul", { className: "feature-requires" });
    for (const requirement of feature.requires) {
      list.append(el("li", { html: `<code>${escapeHtml(requirement)}</code>` }));
    }
    panel.append(list);
  }

  // ---- options -------------------------------------------------------------
  if (feature.options?.length) {
    panel.append(el("h4", { className: "feature-detail__label", text: "Configurable options" }));
    const list = el("dl", { className: "feature-options" });
    for (const option of feature.options) {
      list.append(el("dt", { text: option.name }));
      list.append(el("dd", { text: option.desc }));
    }
    panel.append(list);
  }

  // ---- live viewer jump ----------------------------------------------------
  if (feature.demoMenu && onDemo) {
    const demoMenu = feature.demoMenu;
    const button = el("button", {
      className: `card-btn ${demoColor} feature-detail__demo`,
      attrs: { type: "button" },
      text: "Open this in the live menu ↓",
    });
    button.addEventListener("click", () => onDemo(demoMenu));
    panel.append(button);
  }

  return panel;
}

export function initFeatureExplorer(options: {
  features: Feature[];
  grid: HTMLElement;
  detail: HTMLElement;
  onDemo?: (menuId: string) => void;
  onSelect?: () => void;
  demoColor?: LinkColor;
}): FeatureExplorer {
  const { features, grid, detail } = options;
  const demoColor = options.demoColor ?? "gold";
  let current = "";

  function select(id: string): void {
    const feature = features.find((entry) => entry.id === id);
    if (!feature || feature.id === current) return;
    current = feature.id;

    qsa<HTMLElement>("[data-feature]", grid).forEach((tile) => {
      const active = tile.dataset["feature"] === feature.id;
      tile.classList.toggle("is-active", active);
      tile.setAttribute("aria-pressed", String(active));
    });

    detail.replaceChildren(buildDetail(feature, options.onDemo, demoColor));
    detail.scrollTop = 0;
    options.onSelect?.();
  }

  grid.replaceChildren();
  for (const feature of features) grid.append(buildTile(feature, select));

  const first = features[0];
  if (first) {
    detail.replaceChildren(buildDetail(first, options.onDemo, demoColor));
    current = first.id;
    const tile = grid.querySelector<HTMLElement>(`[data-feature="${first.id}"]`);
    tile?.classList.add("is-active");
    tile?.setAttribute("aria-pressed", "true");
  }

  return { select };
}
