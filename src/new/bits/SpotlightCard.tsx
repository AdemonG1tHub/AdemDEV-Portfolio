import { useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { gsap } from "gsap";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Spotlight colour, any CSS colour. */
  spotlight?: string;
  /** Max tilt in degrees; 0 disables. */
  tilt?: number;
}

/** Cursor-following spotlight (React Bits' <SpotlightCard />) with a subtle GSAP 3D tilt. */
export default function SpotlightCard({ children, spotlight = "rgba(255,255,255,.16)", tilt = 4, className = "", style, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = typeof matchMedia === "function" && matchMedia("(hover:hover) and (pointer:fine)").matches;

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !fine || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      gsap.to(el, {
        rotateY: (x / r.width - 0.5) * tilt * 2,
        rotateX: -(y / r.height - 0.5) * tilt * 2,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
        transformPerspective: 1100,
      });
    }
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot", "0");
    if (tilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
  };

  return (
    <div
      ref={ref}
      className={`spot ${className}`}
      style={{ "--spotlight": spotlight, ...style } as CSSProperties}
      onPointerMove={move}
      onPointerEnter={() => ref.current?.style.setProperty("--spot", "1")}
      onPointerLeave={leave}
      {...rest}
    >
      {children}
    </div>
  );
}
