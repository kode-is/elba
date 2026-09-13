"use client";

import { useEffect, useRef, useState } from "react";

type StatCounterProps = {
  value: string;
  suffix: string;
  label: string;
};

/**
 * Renders `value` immediately (so the server-rendered HTML — and the verify
 * script, and crawlers — always see the settled number). Once scrolled into
 * view it counts up from 0 to `value` over ~1.5s, unless the visitor prefers
 * reduced motion, in which case it just stays at `value`.
 */
export function StatCounter({ value, suffix, label }: StatCounterProps) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const target = Number(value.replace(/[^0-9.-]/g, "")) || 0;
    const duration = 1500;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasAnimated.current) continue;
          hasAnimated.current = true;

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(String(Math.round(progress * target)));
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setDisplay(value);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="flex items-baseline gap-1">
        <span className="font-stat text-4xl font-bold text-white md:text-5xl">{display}</span>
        <span className="font-stat text-4xl font-bold text-brand-mid md:text-5xl">{suffix}</span>
      </div>
      <p className="mt-2 font-stat text-sm font-medium text-white/80">{label}</p>
    </div>
  );
}
