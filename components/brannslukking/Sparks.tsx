import type { CSSProperties } from "react";

// Fixed, not random: the positions must be identical on the server and the
// client, and a hand-tuned spread reads better than noise anyway.
const SPARKS = [
  { left: 8, bottom: 6, size: 3, dur: 9, delay: 0, drift: 18 },
  { left: 17, bottom: 2, size: 2, dur: 7, delay: 2.4, drift: -10 },
  { left: 26, bottom: 10, size: 4, dur: 10, delay: 4.1, drift: 22 },
  { left: 38, bottom: 0, size: 2, dur: 8, delay: 1.2, drift: 14 },
  { left: 49, bottom: 8, size: 3, dur: 11, delay: 5.6, drift: -16 },
  { left: 57, bottom: 3, size: 2, dur: 7.5, delay: 3.3, drift: 10 },
  { left: 64, bottom: 12, size: 4, dur: 12, delay: 0.8, drift: 26 },
  { left: 71, bottom: 4, size: 3, dur: 8.5, delay: 6.2, drift: -20 },
  { left: 78, bottom: 9, size: 2, dur: 9.5, delay: 2, drift: 12 },
  { left: 84, bottom: 1, size: 4, dur: 10.5, delay: 4.7, drift: -14 },
  { left: 91, bottom: 7, size: 2, dur: 7, delay: 1.7, drift: 16 },
  { left: 96, bottom: 3, size: 3, dur: 9, delay: 3.9, drift: -8 },
];

/**
 * Sparks drifting up through /brannslukking's photo hero, in the brand's
 * white and the rose the red tiles use for copy (`brand-soft`). Decorative;
 * hidden under prefers-reduced-motion (app/globals.css).
 */
export function Sparks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className={`animate-spark-rise absolute rounded-full ${
            i % 3 === 0 ? "bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]" : "bg-brand-soft shadow-[0_0_8px_2px_rgba(193,30,49,0.6)]"
          }`}
          style={
            {
              left: `${s.left}%`,
              bottom: `${s.bottom}%`,
              width: s.size,
              height: s.size,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
              "--drift": `${s.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
