/** Shared click SFX. Autoplay rejections are swallowed — sound is decorative. */
export interface UiSounds {
  play(): void;
  bind(selector: string, root?: ParentNode): void;
}

export function createUiSounds(src = "/sounds/minecraft_click.mp3", volume = 0.25): UiSounds {
  const audio = new Audio(src);
  audio.volume = volume;

  function play(): void {
    try {
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    } catch {
      /* autoplay guard */
    }
  }

  function bind(selector: string, root: ParentNode = document): void {
    root.querySelectorAll(selector).forEach((node) => node.addEventListener("click", play));
  }

  return { play, bind };
}
