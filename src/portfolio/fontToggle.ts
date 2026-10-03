import { byId } from "@/lib/dom";

export type FontMode = "default" | "minecraft";

const VALID = new Set<FontMode>(["default", "minecraft"]);

/**
 * The Default/Minecraft font switch on the modals, an OreUI Toggles group. The
 * library selects tabs on click and arrow keys and fires `change`; this applies
 * the font. The choice is remembered per-modal in localStorage, which may throw
 * in private mode, so every access is guarded.
 */
export function initFontToggle(options: {
  storageKey: string;
  modal: HTMLElement;
  bodyClass: string;
  defaultButtonId: string;
  minecraftButtonId: string;
}): { apply(mode?: FontMode): void; stored(): FontMode } {
  const defaultBtn = byId<HTMLButtonElement>(options.defaultButtonId);
  const minecraftBtn = byId<HTMLButtonElement>(options.minecraftButtonId);

  function stored(): FontMode {
    try {
      const value = localStorage.getItem(options.storageKey) as FontMode | null;
      return value && VALID.has(value) ? value : "default";
    } catch {
      return "default";
    }
  }

  function persist(mode: FontMode): void {
    try {
      localStorage.setItem(options.storageKey, mode);
    } catch {
      /* storage blocked */
    }
  }

  function apply(mode: FontMode = stored()): void {
    const resolved = VALID.has(mode) ? mode : "default";
    options.modal.classList.toggle(options.bodyClass, resolved === "minecraft");
    for (const [btn, isActive] of [
      [defaultBtn, resolved === "default"],
      [minecraftBtn, resolved === "minecraft"],
    ] as const) {
      if (!btn) continue;
      // OreUI Tab Buttons: the library's controller watches `aria-selected`
      // and keeps roving tabindex in step with it.
      btn.setAttribute("aria-selected", String(isActive));
    }
  }

  defaultBtn?.addEventListener("change", () => {
    apply("default");
    persist("default");
  });
  minecraftBtn?.addEventListener("change", () => {
    apply("minecraft");
    persist("minecraft");
  });

  return { apply, stored };
}
