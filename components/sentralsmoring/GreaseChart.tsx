"use client";

import { useId } from "react";
import { greaseLevel, OPTIMAL } from "@/lib/smoremodell";
import { ILL } from "@/lib/illustrasjon";
import type { LubeMode } from "@/lib/sentralsmoring";

const X0 = 46;
const X1 = 492;
const Y0 = 12;
const Y1 = 168;
const MAX = 150;

const xFor = (t: number) => X0 + (X1 - X0) * t;
const yFor = (level: number) => Y1 - (Math.min(level, MAX) / MAX) * (Y1 - Y0);

const SAMPLES = 320;
function curve(mode: LubeMode) {
  return Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES;
    return `${i ? "L" : "M"}${xFor(t).toFixed(1)} ${yFor(greaseLevel(mode, t)).toFixed(1)}`;
  }).join(" ");
}
const CURVES: Record<LubeMode, string> = { automatisk: curve("automatisk"), manuell: curve("manuell") };

// ELBA red is ELBA's own curve; the manual one is black. The zones stay
// neutral so red never means two things in the same chart.
const STROKE: Record<LubeMode, string> = { automatisk: ILL.brand, manuell: "#000000" };

/**
 * Grease in the bearing through the working day: the chosen mode drawn up to
 * the clock, the other mode faint behind it for comparison, and the band that
 * counts as the right amount. An illustration, not a measurement.
 */
export function GreaseChart({ mode, t, full, small = false }: { mode: LubeMode; t: number; full: boolean; small?: boolean }) {
  const clip = useId();
  const other: LubeMode = mode === "automatisk" ? "manuell" : "automatisk";
  const level = greaseLevel(mode, t);
  const font = { fontFamily: "var(--font-inter)", fontSize: small ? 20 : 13 } as const;
  return (
    <svg viewBox="0 0 520 196" role="img" aria-label="Fettmengde i lageret gjennom arbeidsdagen, som illustrasjon" className="block h-auto w-full">
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width={full ? 520 : xFor(t)} height="196" />
        </clipPath>
      </defs>
      {/* The right amount, between too much and too little */}
      <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill={ILL.surface} />
      <rect x={X0} y={yFor(OPTIMAL.high)} width={X1 - X0} height={yFor(OPTIMAL.low) - yFor(OPTIMAL.high)} fill="#ffffff" stroke={ILL.line} />
      <text x={X1 - 8} y={Y0 + (small ? 22 : 16)} textAnchor="end" fill={ILL.inkMuted} {...font}>
        For mye
      </text>
      <text x={X1 - 8} y={yFor(OPTIMAL.high) + (small ? 22 : 16)} textAnchor="end" fill={ILL.inkMuted} fontWeight="600" {...font}>
        Riktig mengde
      </text>
      <text x={X1 - 8} y={Y1 - 8} textAnchor="end" fill={ILL.inkMuted} {...font}>
        For lite
      </text>
      <text x="14" y={(Y0 + Y1) / 2} textAnchor="middle" fill={ILL.inkMuted} transform={`rotate(-90 14 ${(Y0 + Y1) / 2})`} {...font}>
        Fett i lageret
      </text>
      {/* Hours */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={xFor(f)} x2={xFor(f)} y1={Y1} y2={Y1 + 5} stroke={ILL.inkMuted} />
          <text x={xFor(f)} y={Y1 + (small ? 26 : 22)} textAnchor={f === 1 ? "end" : f === 0 ? "start" : "middle"} fill={ILL.inkMuted} {...font}>
            {`kl. ${String(7 + f * 8).padStart(2, "0")}`}
          </text>
        </g>
      ))}
      <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={ILL.inkMuted} />
      {/* The other mode, faint; the chosen one, drawn up to the clock */}
      <path d={CURVES[other]} fill="none" stroke={STROKE[other]} strokeWidth="2" strokeLinejoin="round" opacity="0.3" />
      <path
        d={CURVES[mode]}
        fill="none"
        stroke={STROKE[mode]}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        clipPath={`url(#${clip})`}
      />
      {!full ? (
        <g>
          <line x1={xFor(t)} x2={xFor(t)} y1={Y0} y2={Y1} stroke="#000000" strokeWidth="1" opacity="0.25" />
          <circle cx={xFor(t)} cy={yFor(level)} r="5.5" fill="#ffffff" stroke={STROKE[mode]} strokeWidth="3" />
        </g>
      ) : null}
    </svg>
  );
}
