import { byId, qsa } from "./dom";

/** Mobile nav toggle + close-on-navigate. Shared by both pages. */
export function initNav(): void {
  const toggle = byId<HTMLButtonElement>("nav-toggle");
  const nav = byId("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  qsa<HTMLAnchorElement>("#nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/** Adds/removes `.pressed` so buttons dim while held. */
export function initButtonPressStates(selector = ".bb-btn"): void {
  qsa<HTMLElement>(selector).forEach((node) => {
    node.addEventListener("pointerdown", () => node.classList.add("pressed"));
    const clear = (): void => node.classList.remove("pressed");
    node.addEventListener("pointerup", clear);
    node.addEventListener("pointerleave", clear);
    node.addEventListener("blur", clear);
  });
}

/** Copy-to-clipboard box with a transient "Copied" label. */
export function initCopyBox(boxId: string, labelSelector: string, value: string): void {
  const box = byId(boxId);
  if (!box) return;
  const label = box.querySelector<HTMLElement>(labelSelector);
  if (!label) return;
  const original = label.textContent ?? "Click to copy";

  box.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
      label.textContent = "Copied";
    } catch {
      label.textContent = "Copy failed";
    }
    window.setTimeout(() => {
      label.textContent = original;
    }, 1200);
  });
}
