import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSplit } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSplit);

interface Props {
  text: string;
  className?: string;
  delay?: number;
  onScroll?: boolean;
}

/** Words resolve out of a blur — React Bits' <BlurText />. */
export default function BlurText({ text, className, delay = 0, onScroll = false }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split: GSplit | undefined;
    let tween: gsap.core.Tween | undefined;
    let dead = false;
    document.fonts.ready.then(() => {
      if (dead) return;
      split = new GSplit(el, { type: "words" });
      tween = gsap.fromTo(
        split.words,
        { opacity: 0, y: 18, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.045,
          delay,
          scrollTrigger: onScroll ? { trigger: el, start: "top 90%", once: true } : undefined,
        },
      );
    });
    return () => {
      dead = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [text, delay, onScroll]);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
