/**
 * Open/close bookkeeping for the OreUI modals (`dialog.ore-modal`).
 *
 * A dialog can close three ways: our own `close()`, Escape (native), or a
 * backdrop click (OreUI's modal controller). `onClosed` runs exactly once for
 * each of them, synchronously for `close()` — routing relies on that, since it
 * closes and reopens inside one `routeState.syncing` window.
 */
export interface DialogHandle {
  open(): void;
  close(): void;
  isOpen(): boolean;
}

export function bindDialog(dialog: HTMLDialogElement, onClosed: () => void = () => undefined): DialogHandle {
  let active = false;

  function finish(): void {
    if (!active) return;
    active = false;
    document.body.style.overflow = "";
    onClosed();
  }

  dialog.addEventListener("close", () => {
    // `close` is dispatched async. If the dialog was closed and reopened in the
    // meantime (switching items), this event is stale — leave it open.
    if (!dialog.open) finish();
  });

  return {
    open(): void {
      active = true;
      document.body.style.overflow = "hidden";
      if (!dialog.open) dialog.showModal();
    },
    close(): void {
      if (dialog.open) dialog.close();
      finish();
    },
    isOpen(): boolean {
      return dialog.open;
    },
  };
}

/** Arrow keys on a focused tab belong to its tab list, not the gallery. */
export function isTabTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[role="tab"]') !== null;
}
