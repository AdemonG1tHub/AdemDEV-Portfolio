import { el } from "@/lib/dom";
import { renderMcText, stripMcCodes } from "@/lib/mcText";
import type { ChestItem, ChestMenu, ChestSkin } from "@/types/addon";
import type { RenderContext } from "./context";

/**
 * `ChestFormData` recreation — the vanilla container UI the shop and the log
 * filters use.
 *
 * Slots run 9 per row, so `size: 54` is the "double" chest. Hovering a filled
 * slot raises the vanilla tooltip: item name on the first line, lore beneath,
 * both `§`-formatted.
 */

const SLOTS_PER_ROW = 9;

function buildSlot(item: ChestItem | undefined, ctx: RenderContext, tooltip: HTMLElement): HTMLElement {
  const slot = el("div", { className: "mcui-slot" });
  if (!item) return slot;

  slot.classList.add("is-filled");

  // A pane with no name, no lore and nowhere to go is a `pattern(...)` spacer —
  // give it no tooltip, no focus stop and no pointer.
  const isFiller =
    stripMcCodes(item.name).trim().length === 0 &&
    (item.lore ?? []).length === 0 &&
    !item.opens &&
    !item.note;

  if (isFiller) {
    slot.classList.add("is-filler");
    slot.setAttribute("aria-hidden", "true");
    const glyph = el("div", { className: "mcui-slot__icon" });
    glyph.append(el("span", { className: "mcui-slot__glyph", text: item.glyph ?? "▪" }));
    slot.append(glyph);
    return slot;
  }

  slot.setAttribute("role", "button");
  slot.setAttribute("tabindex", "0");
  slot.setAttribute("aria-label", stripMcCodes(ctx.text(item.name)));

  const icon = el("div", { className: `mcui-slot__icon${item.enchanted ? " is-enchanted" : ""}` });
  if (item.icon) {
    icon.append(
      el("img", { attrs: { src: item.icon, alt: "", loading: "lazy", "aria-hidden": "true" } }),
    );
  } else {
    icon.append(el("span", { className: "mcui-slot__glyph", text: item.glyph ?? "▧" }));
  }
  slot.append(icon);

  if (item.stack && item.stack > 1) {
    slot.append(el("span", { className: "mcui-slot__stack", text: String(Math.min(99, item.stack)) }));
  }

  const showTooltip = (): void => {
    tooltip.replaceChildren();

    const name = el("div", { className: "mcui-tooltip__name" });
    renderMcText(name, ctx.text(item.name));
    tooltip.append(name);

    for (const line of item.lore ?? []) {
      const lore = el("div", { className: "mcui-tooltip__lore" });
      renderMcText(lore, ctx.text(line));
      tooltip.append(lore);
    }

    const panel = tooltip.parentElement;
    if (!panel) {
      tooltip.hidden = false;
      return;
    }

    // Anchor below-right of the slot like the game does, then flip whichever
    // way is needed to stay inside the viewer stage — which clips its overflow,
    // so a tooltip that spills would simply be cut off.
    tooltip.style.left = "0px";
    tooltip.style.top = "0px";
    tooltip.hidden = false;

    const stage = panel.closest(".mcui") ?? panel;
    const stageBox = stage.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();
    const slotBox = slot.getBoundingClientRect();
    const tipBox = tooltip.getBoundingClientRect();

    let left = slotBox.right + 6;
    if (left + tipBox.width > stageBox.right - 4) {
      left = Math.max(stageBox.left + 4, slotBox.left - tipBox.width - 6);
    }

    let top = slotBox.top + 10;
    if (top + tipBox.height > stageBox.bottom - 4) {
      top = Math.max(stageBox.top + 4, stageBox.bottom - tipBox.height - 4);
    }

    tooltip.style.left = `${left - panelBox.left}px`;
    tooltip.style.top = `${top - panelBox.top}px`;
  };

  const hideTooltip = (): void => {
    tooltip.hidden = true;
  };

  slot.addEventListener("pointerenter", showTooltip);
  slot.addEventListener("focus", showTooltip);
  slot.addEventListener("pointerleave", hideTooltip);
  slot.addEventListener("blur", hideTooltip);

  const activate = (): void => {
    ctx.sfx();
    if (item.opens) ctx.navigate(item.opens);
    else if (item.note) ctx.toast(ctx.text(item.note));
  };

  slot.addEventListener("click", activate);
  slot.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate();
  });

  return slot;
}

export function renderChestForm(menu: ChestMenu, ctx: RenderContext, skin?: ChestSkin): HTMLElement {
  const panel = el("div", { className: "mcui-chest" });

  // Each add-on ships its own container textures; fall back to the vanilla grey.
  if (skin) {
    panel.style.setProperty("--mcui-slot-texture", `url("${skin.slot}")`);
    panel.style.setProperty("--mcui-chest-panel", skin.panel);
    panel.style.setProperty("--mcui-chest-border", skin.border);
    panel.style.setProperty("--mcui-chest-title", skin.title);
    panel.style.setProperty("--mcui-chest-close", skin.close);
  }

  const header = el("div", { className: "mcui-chest__header" });
  const titles = el("div", { className: "mcui-chest__titles" });
  for (const line of menu.titleLines ?? [menu.title]) {
    const row = el("div", { className: "mcui-chest__title" });
    renderMcText(row, ctx.text(line));
    titles.append(row);
  }
  header.append(titles);

  const close = el("button", {
    className: "mcui-chest__close",
    attrs: { type: "button", "aria-label": "Close menu" },
    text: "✕",
  });
  close.addEventListener("click", () => {
    ctx.sfx();
    ctx.close();
  });
  header.append(close);
  panel.append(header);

  const tooltip = el("div", { className: "mcui-tooltip", attrs: { role: "tooltip" } });
  tooltip.hidden = true;

  const grid = el("div", { className: "mcui-chest__grid" });
  const bySlot = new Map(menu.items.map((item) => [item.slot, item]));
  for (let i = 0; i < menu.size; i++) {
    grid.append(buildSlot(bySlot.get(i), ctx, tooltip));
  }
  grid.style.setProperty("--mcui-slot-columns", String(SLOTS_PER_ROW));
  panel.append(grid);
  panel.append(tooltip);

  return panel;
}
