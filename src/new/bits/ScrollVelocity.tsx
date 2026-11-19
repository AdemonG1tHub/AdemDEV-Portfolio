import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { getLenis } from "../lenis";

interface Props {
  items: ReactNode[];
  /** px per second; negative runs the other way. */
  speed?: number;
  className?: string;
}

/** Marquee that speeds up with scroll velocity — React Bits' <ScrollVelocity />, driven by Lenis. */
export default function ScrollVelocity({ items, speed = 60, className = "" }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current;
    const g = group.current;
    if (!t || !g) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let boost = 0;
    const dir = Math.sign(speed) || 1;
    const tick = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60;
      const v = getLenis()?.velocity ?? 0;
      boost += (Math.min(Math.abs(v), 40) / 6 - boost) * 0.08;
      const w = g.offsetWidth;
      if (!w) return;
      x -= dir * (Math.abs(speed) * (1 + boost)) * dt;
      x = ((x % w) + w) % w;
      gsap.set(t, { x: -x });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed]);

  const row = (key: string, hidden = false) => (
    <div className="marquee-group" key={key} ref={hidden ? undefined : group} aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span className="marquee-item" key={i}>
          {it}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track" ref={track}>
        {row("a")}
        {row("b", true)}
        {row("c", true)}
      </div>
    </div>
  );
}
