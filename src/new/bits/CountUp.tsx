import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counts up to the leading number of `value` ("3+" → 0…3 then "+"); values with no
 * number ("Owner") are shown as-is. After React Bits' <CountUp />.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = /^(\d+)(.*)$/.exec(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const end = Number(m[1]);
    const suffix = m[2] ?? "";
    const state = { n: 0 };
    el.textContent = `0${suffix}`;
    const tween = gsap.to(state, {
      n: end,
      duration: 1.8,
      ease: "power3.out",
      onUpdate: () => (el.textContent = `${Math.round(state.n)}${suffix}`),
      scrollTrigger: { trigger: el, start: "top 95%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
