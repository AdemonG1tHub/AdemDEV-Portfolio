import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/** Smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function startLenis(): Lenis | null {
  if (instance) return instance;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  instance = lenis;
  return lenis;
}

export function stopLenis() {
  if (tick) gsap.ticker.remove(tick);
  instance?.destroy();
  instance = null;
  tick = null;
}

export const getLenis = () => instance;

export function scrollToTarget(target: string | number) {
  if (instance) instance.scrollTo(target, { offset: 0, duration: 1.4 });
  else if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: target, behavior: "smooth" });
}
