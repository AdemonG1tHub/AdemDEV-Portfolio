import { el } from "@/lib/dom";
import { mcTextElement, renderMcText, stripMcCodes } from "@/lib/mcText";
import type { ActionGridMenu, ActionListMenu, MenuButton } from "@/types/addon";
import type { RenderContext } from "./context";

/**
 * `ActionFormData` recreations.
 *
 * The add-on ships two layouts over the same form type, so this module renders
 * both:
 *
 *   "action-grid" — the tiled main menu: icon above a centred caption, three
 *                   per row, inside the salmon window frame.
 *   "action-list" — every other Action form: a standalone icon to the left of a
 *                   full-width button row.
 */

function buildButton(button: MenuButton, ctx: RenderContext, variant: "grid" | "list"): HTMLElement {
  const isInteractive = !button.disabled && (button.opens !== undefined || button.note !== undefined);

  const node = el("button", {
    className: `mcui-btn mcui-btn--${variant}${button.disabled ? " is-disabled" : ""}`,
    attrs: {
      type: "button",
      "aria-label": stripMcCodes(ctx.text(button.label)),
      ...(button.disabled ? { disabled: "" } : {}),
    },
  });

  if (variant === "grid" && button.icon) {
    node.append(
      el("img", {
        className: "mcui-btn__icon",
        attrs: { src: button.icon, alt: "", loading: "lazy", "aria-hidden": "true" },
      }),
    );
  }

  node.append(mcTextElement(ctx.text(button.label), "span", "mcui-btn__label"));

  if (isInteractive) {
    node.addEventListener("click", () => {
      ctx.sfx();
      if (button.opens) ctx.navigate(button.opens);
      else if (button.note) ctx.toast(ctx.text(button.note));
    });
  } else if (!button.disabled) {
    node.classList.add("is-inert");
  }

  if (variant !== "list") return node;

  // List rows put the icon outside the button, matching the in-game layout.
  const row = el("div", { className: "mcui-row" });
  row.append(
    button.icon
      ? el("img", {
          className: "mcui-row__icon",
          attrs: { src: button.icon, alt: "", loading: "lazy", "aria-hidden": "true" },
        })
      : el("div", { className: "mcui-row__icon mcui-row__icon--empty" }),
  );
  row.append(node);
  return row;
}

export function renderActionForm(menu: ActionGridMenu | ActionListMenu, ctx: RenderContext): HTMLElement {
  const body = el("div", { className: "mcui-body" });

  if (menu.body) {
    const text = el("div", { className: "mcui-body__text" });
    renderMcText(text, ctx.text(menu.body));
    body.append(text);
  }

  if (menu.kind === "action-grid") {
    const grid = el("div", { className: "mcui-grid" });
    grid.style.setProperty("--mcui-columns", String(menu.columns ?? 3));
    for (const button of menu.buttons) grid.append(buildButton(button, ctx, "grid"));
    body.append(grid);
  } else {
    const list = el("div", { className: "mcui-list" });
    for (const button of menu.buttons) list.append(buildButton(button, ctx, "list"));
    body.append(list);
  }

  return body;
}
