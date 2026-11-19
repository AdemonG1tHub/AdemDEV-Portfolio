import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";

/** Pulls its child toward the cursor — React Bits' <Magnet />. */
export default function Magnet({ children, strength = 0.25, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = typeof matchMedia === "function" && matchMedia("(hover:hover) and (pointer:fine)").matches;
  return (
    <div
      ref={ref}
      className={`magnet ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || !fine) return;
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
          duration: 0.4,
          ease: "power3.out",
        });
      }}
      onPointerLeave={() => ref.current && gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,.4)" })}
    >
      {children}
    </div>
  );
}
