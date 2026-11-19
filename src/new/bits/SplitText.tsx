import { useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSplit } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSplit);

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Start when scrolled into view (default) or immediately. */
  onScroll?: boolean;
}

/** Per-character masked reveal — React Bits' <SplitText />, on GSAP's SplitText plugin. */
export default function SplitText({ text, as: Tag = "h2", className, delay = 0, stagger = 0.035, onScroll = true }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split: GSplit | undefined;
    let tween: gsap.core.Tween | undefined;
    let dead = false;

    document.fonts.ready.then(() => {
      if (dead) return;
      split = new GSplit(el, { type: "lines,chars", mask: "lines", charsClass: "split-char", linesClass: "split-line" });
      tween = gsap.from(split.chars, {
        yPercent: 110,
        rotate: 6,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: onScroll ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
    });

    return () => {
      dead = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [text, delay, stagger, onScroll]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
