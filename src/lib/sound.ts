/**
 * Shared click SFX. Autoplay rejections are swallowed — sound is decorative.
 *
 * Uses the Web Audio API (decoded buffer, fresh source per click) because a
 * single reused <audio> element goes silent on mobile after it has finished
 * or the page was backgrounded. Falls back to a fresh Audio per click.
 */
export interface UiSounds {
  play(): void;
  bind(selector: string, root?: ParentNode): void;
}

type AudioCtor = typeof AudioContext;

export function createUiSounds(src = "/sounds/minecraft_click.mp3", volume = 0.25): UiSounds {
  const Ctor: AudioCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
  let ctx: AudioContext | null = null;
  let gain: GainNode | null = null;
  let buffer: AudioBuffer | null = null;
  let loading = false;

  function ensureContext(): AudioContext | null {
    if (!Ctor) return null;
    if (!ctx || ctx.state === "closed") {
      try {
        ctx = new Ctor();
        gain = ctx.createGain();
        gain.gain.value = volume;
        gain.connect(ctx.destination);
        buffer = null;
        loading = false;
      } catch {
        ctx = null;
        return null;
      }
    }
    // Mobile browsers suspend (or "interrupt") the context; resume on gestures.
    if (ctx.state !== "running") void ctx.resume().catch(() => undefined);
    return ctx;
  }

  function loadBuffer(context: AudioContext): void {
    if (buffer || loading) return;
    loading = true;
    fetch(src)
      .then((res) => res.arrayBuffer())
      .then((data) => context.decodeAudioData(data))
      .then((decoded) => {
        buffer = decoded;
      })
      .catch(() => undefined)
      .finally(() => {
        loading = false;
      });
  }

  function playFallback(): void {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      void audio.play().catch(() => undefined);
    } catch {
      /* autoplay guard */
    }
  }

  function play(): void {
    const context = ensureContext();
    if (!context || !gain) return playFallback();
    if (!buffer) {
      loadBuffer(context);
      return playFallback();
    }
    try {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      source.start(0);
    } catch {
      playFallback();
    }
  }

  // Unlock audio and preload on the first touch/click.
  const unlock = (): void => {
    const context = ensureContext();
    if (context) loadBuffer(context);
  };
  document.addEventListener("pointerdown", unlock, { passive: true });
  document.addEventListener("touchend", unlock, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) unlock();
  });

  function bind(selector: string, root: ParentNode = document): void {
    root.querySelectorAll(selector).forEach((node) => node.addEventListener("click", play));
  }

  return { play, bind };
}
