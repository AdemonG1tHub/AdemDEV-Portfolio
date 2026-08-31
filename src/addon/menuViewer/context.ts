import type { MenuId } from "@/types/addon";

/** Services the individual form renderers need from the viewer shell. */
export interface RenderContext {
  /** Substitutes `{player}` and any other placeholders in menu text. */
  text(input: string): string;
  /** Pushes a menu onto the navigation stack. */
  navigate(id: MenuId): void;
  /** Leaves the current menu — to its `back` target, or the root menu. */
  close(): void;
  /** Shows a chat-style line under the window, like the add-on's sendMessage. */
  toast(message: string): void;
  /** Plays the shared click sound. */
  sfx(): void;
}
