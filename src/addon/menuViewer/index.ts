import { el } from "@/lib/dom";
import { mcTextElement, renderMcText, stripMcCodes } from "@/lib/mcText";
import type { AddonMenu, MenuId, MenuViewerConfig } from "@/types/addon";
import { renderActionForm } from "./actionForm";
import { renderChestForm } from "./chestForm";
import type { RenderContext } from "./context";
import { renderModalForm } from "./modalForm";

/**
 * The live menu viewer: a CSS/DOM recreation of the add-on's in-game UI that
 * visitors can click through.
 *
 * Everything on screen comes from `src/config/gilded-menus.config.ts` — the
 * buttons, their labels, and which menu each one opens — so the preview can be
 * reshaped without touching this file.
 *
 * Chrome comes from the config's `skin`:
 *   "gilded"  blue strip carrying `headerText`, a diagonal cut into the orange
 *             title plate, and a salmon frame around the dark body. Modal forms
 *             swap that for one solid salmon bar with the title centred.
 *   "chest"   for add-ons whose every menu is a container UI — the chest draws
 *             its own vanilla chrome, so no outer frame is added.
 */

export interface MenuViewer {
  /** Opens a menu by id, resetting the history to it. */
  goTo(id: MenuId): void;
  /** Returns to the configured root menu. */
  reset(): void;
}

export function createMenuViewer(
  host: HTMLElement,
  config: MenuViewerConfig,
  options: { onSound?: () => void } = {},
): MenuViewer {
  let history: MenuId[] = [config.rootMenu];
  let toastTimer: number | null = null;

  const skin = config.skin ?? "gilded";
  const window_ = el("div", { className: "mcui-window" });
  const toastBar = el("div", { className: "mcui-toast", attrs: { role: "status", "aria-live": "polite" } });
  toastBar.hidden = true;

  const breadcrumb = el("nav", { className: "mcui-breadcrumb", attrs: { "aria-label": "Menu history" } });

  host.replaceChildren(breadcrumb, window_, toastBar);

  function currentId(): MenuId {
    return history[history.length - 1] ?? config.rootMenu;
  }

  function resolve(id: MenuId): AddonMenu | undefined {
    return config.menus[id];
  }

  /** Substitutes placeholders so config text can stay copy-pasted from source. */
  function text(input: string): string {
    return input.replace(/\{player\}/g, config.playerName).replace(/\{server\}/g, config.serverName);
  }

  function sfx(): void {
    options.onSound?.();
  }

  function toast(message: string): void {
    renderMcText(toastBar, message);
    toastBar.hidden = false;
    if (toastTimer !== null) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastBar.hidden = true;
    }, 3200);
  }

  function navigate(id: MenuId): void {
    if (!resolve(id)) {
      toast(`§cMenu "${id}" is not defined in the viewer config.`);
      return;
    }
    history.push(id);
    render();
  }

  function back(): void {
    const menu = resolve(currentId());
    sfx();
    if (menu?.back && resolve(menu.back)) {
      history.push(menu.back);
    } else if (history.length > 1) {
      history.pop();
    } else {
      return;
    }
    render();
  }

  function reset(): void {
    history = [config.rootMenu];
    toastBar.hidden = true;
    render();
  }

  /** The ✕ on a window leaves for its `back` target, or home. */
  function closeCurrent(): void {
    const menu = resolve(currentId());
    if (menu?.back && resolve(menu.back)) navigate(menu.back);
    else reset();
  }

  const ctx: RenderContext = { text, navigate, close: closeCurrent, toast, sfx };

  /** Blue + orange split header used by Action windows. */
  function buildSplitHeader(menu: AddonMenu): HTMLElement {
    const header = el("div", { className: "mcui-header" });

    const close = el("button", {
      className: "mcui-header__close",
      attrs: { type: "button", "aria-label": "Close menu" },
    });
    close.addEventListener("click", () => {
      sfx();
      closeCurrent();
    });

    header.append(close);
    header.append(el("span", { className: "mcui-header__brand", text: config.headerText }));
    header.append(mcTextElement(text(menu.title), "span", "mcui-header__title"));
    return header;
  }

  /** Solid salmon bar with a centred title — the ModalFormData skin. */
  function buildModalHeader(menu: AddonMenu): HTMLElement {
    const header = el("div", { className: "mcui-header mcui-header--modal" });
    header.append(mcTextElement(text(menu.title), "span", "mcui-header__title" ));
    const close = el("button", {
      className: "mcui-header__close mcui-header__close--right",
      attrs: { type: "button", "aria-label": "Close menu" },
    });
    close.addEventListener("click", () => {
      sfx();
      closeCurrent();
    });
    header.append(close);
    return header;
  }

  function renderBreadcrumb(): void {
    breadcrumb.replaceChildren();

    const backBtn = el("button", {
      className: "mcui-breadcrumb__back",
      attrs: { type: "button", "aria-label": "Go back" },
      text: "◀ Back",
    });
    backBtn.disabled = history.length <= 1 && !resolve(currentId())?.back;
    backBtn.addEventListener("click", back);
    breadcrumb.append(backBtn);

    const menu = resolve(currentId());
    breadcrumb.append(
      el("span", {
        className: "mcui-breadcrumb__label",
        text: menu ? (menu.navLabel ?? stripMcCodes(text(menu.title))) : currentId(),
      }),
    );

    const kindLabels: Record<AddonMenu["kind"], string> = {
      "action-grid": "ActionFormData · grid",
      "action-list": "ActionFormData",
      chest: "ChestFormData",
      modal: "ModalFormData",
    };
    if (menu) {
      breadcrumb.append(el("span", { className: "mcui-breadcrumb__kind", text: kindLabels[menu.kind] }));
    }

    const home = el("button", {
      className: "mcui-breadcrumb__home",
      attrs: { type: "button" },
      text: "Main menu",
    });
    home.addEventListener("click", () => {
      sfx();
      reset();
    });
    breadcrumb.append(home);
  }

  function render(): void {
    const menu = resolve(currentId());
    window_.replaceChildren();
    window_.className = `mcui-window mcui-window--skin-${skin}`;

    if (!menu) {
      window_.append(el("div", { className: "mcui-body", text: `Unknown menu: ${currentId()}` }));
      renderBreadcrumb();
      return;
    }

    window_.classList.add(`mcui-window--${menu.kind}`);

    if (menu.kind === "chest") {
      window_.append(renderChestForm(menu, ctx, config.chest));
    } else if (menu.kind === "modal") {
      window_.append(buildModalHeader(menu));
      window_.append(renderModalForm(menu, ctx));
    } else {
      window_.append(buildSplitHeader(menu));
      window_.append(renderActionForm(menu, ctx));
    }

    renderBreadcrumb();
  }

  render();

  return {
    goTo(id: MenuId): void {
      if (!resolve(id)) return;
      history = [id];
      toastBar.hidden = true;
      render();
    },
    reset,
  };
}
