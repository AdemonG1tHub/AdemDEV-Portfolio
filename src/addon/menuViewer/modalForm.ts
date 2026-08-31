import { el } from "@/lib/dom";
import { mcTextElement, renderMcText, stripMcCodes } from "@/lib/mcText";
import type { ModalField, ModalMenu } from "@/types/addon";
import type { RenderContext } from "./context";

/**
 * `ModalFormData` recreation — labelled inputs stacked above a Submit button.
 *
 * Every control is live: text fields accept typing, sliders drag, toggles flip,
 * and dropdowns expand into the checkbox list Bedrock draws (including the green
 * highlight on the selected row). Nothing is submitted anywhere — the form is a
 * preview, so Submit just closes back to the parent menu.
 */

function buildTextField(field: Extract<ModalField, { type: "textField" }>, ctx: RenderContext): HTMLElement {
  const wrap = el("div", { className: "mcui-field" });
  wrap.append(mcTextElement(ctx.text(field.label), "label", "mcui-field__label"));
  wrap.append(
    el("input", {
      className: "mcui-input",
      attrs: {
        type: "text",
        value: field.value ?? "",
        placeholder: stripMcCodes(ctx.text(field.placeholder ?? "")),
        "aria-label": stripMcCodes(ctx.text(field.label)),
      },
    }),
  );
  return wrap;
}

function buildToggle(field: Extract<ModalField, { type: "toggle" }>, ctx: RenderContext): HTMLElement {
  const wrap = el("div", { className: "mcui-field mcui-field--inline" });
  wrap.append(mcTextElement(ctx.text(field.label), "span", "mcui-field__label"));

  const toggle = el("button", {
    className: `mcui-toggle${field.value ? " is-on" : ""}`,
    attrs: {
      type: "button",
      role: "switch",
      "aria-checked": String(Boolean(field.value)),
      "aria-label": stripMcCodes(ctx.text(field.label)),
    },
  });
  toggle.append(el("span", { className: "mcui-toggle__knob" }));
  toggle.addEventListener("click", () => {
    const on = toggle.classList.toggle("is-on");
    toggle.setAttribute("aria-checked", String(on));
    ctx.sfx();
  });

  wrap.append(toggle);
  return wrap;
}

function buildSlider(field: Extract<ModalField, { type: "slider" }>, ctx: RenderContext): HTMLElement {
  const wrap = el("div", { className: "mcui-field" });
  const label = mcTextElement(ctx.text(field.label), "label", "mcui-field__label");

  const value = el("span", {
    className: "mcui-slider__value",
    text: String(field.value ?? field.min),
  });
  label.append(value);
  wrap.append(label);

  const input = el("input", {
    className: "mcui-slider",
    attrs: {
      type: "range",
      min: String(field.min),
      max: String(field.max),
      step: String(field.step ?? 1),
      value: String(field.value ?? field.min),
      "aria-label": stripMcCodes(ctx.text(field.label)),
    },
  });
  input.addEventListener("input", () => {
    value.textContent = input.value;
  });

  wrap.append(input);
  return wrap;
}

function buildDropdown(field: Extract<ModalField, { type: "dropdown" }>, ctx: RenderContext): HTMLElement {
  const wrap = el("div", { className: "mcui-field mcui-dropdown" });
  wrap.append(mcTextElement(ctx.text(field.label), "label", "mcui-field__label"));

  let selected = Math.max(0, Math.min(field.index ?? 0, field.options.length - 1));

  const trigger = el("button", {
    className: "mcui-dropdown__trigger",
    attrs: { type: "button", "aria-haspopup": "listbox", "aria-expanded": "false" },
  });
  const triggerLabel = mcTextElement(field.options[selected] ?? "", "span", "mcui-dropdown__value");
  trigger.append(triggerLabel);
  trigger.append(el("span", { className: "mcui-dropdown__caret", attrs: { "aria-hidden": "true" }, text: "▼" }));

  const list = el("div", { className: "mcui-dropdown__list", attrs: { role: "listbox" } });
  list.hidden = true;

  const rows = field.options.map((option, index) => {
    const row = el("div", {
      className: `mcui-dropdown__option${index === selected ? " is-selected" : ""}`,
      attrs: { role: "option", "aria-selected": String(index === selected), tabindex: "0" },
    });
    row.append(el("span", { className: "mcui-dropdown__check", attrs: { "aria-hidden": "true" } }));
    row.append(mcTextElement(option, "span", "mcui-dropdown__text"));

    const choose = (): void => {
      selected = index;
      rows.forEach((other, i) => {
        other.classList.toggle("is-selected", i === selected);
        other.setAttribute("aria-selected", String(i === selected));
      });
      renderMcText(triggerLabel, field.options[selected] ?? "");
      list.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      ctx.sfx();
    };

    row.addEventListener("click", choose);
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      choose();
    });
    list.append(row);
    return row;
  });

  trigger.addEventListener("click", () => {
    const open = list.hidden;
    list.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    ctx.sfx();
    // Long colour lists open scrolled past the current choice otherwise.
    if (open) rows[selected]?.scrollIntoView({ block: "nearest" });
  });

  wrap.append(trigger);
  wrap.append(list);
  return wrap;
}

function buildField(field: ModalField, ctx: RenderContext): HTMLElement {
  switch (field.type) {
    case "textField":
      return buildTextField(field, ctx);
    case "toggle":
      return buildToggle(field, ctx);
    case "slider":
      return buildSlider(field, ctx);
    case "dropdown":
      return buildDropdown(field, ctx);
  }
}

export function renderModalForm(menu: ModalMenu, ctx: RenderContext): HTMLElement {
  const body = el("div", { className: "mcui-modal" });

  for (const field of menu.fields) body.append(buildField(field, ctx));

  const submit = el("button", {
    className: "mcui-submit",
    attrs: { type: "button" },
    text: menu.submitLabel ?? "Submit",
  });
  submit.addEventListener("click", () => {
    ctx.sfx();
    if (menu.note) ctx.toast(ctx.text(menu.note));
    const target = menu.submits ?? menu.back;
    if (target) ctx.navigate(target);
  });

  body.append(submit);
  return body;
}
