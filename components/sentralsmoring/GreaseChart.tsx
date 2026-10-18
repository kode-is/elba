"use client";

import { useId } from "react";
import { greaseLevel, OPTIMAL } from "@/lib/smoremodell";
import type { LubeMode } from "@/lib/sentralsmoring";

const X0 = 46;
const X1 = 492;
const Y0 = 12;
const Y1 = 168;
const MAX = 190;

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

const STROKE: Record<LubeMode, string> = { automatisk: "#c11e31", manuell: "#000000" };

/**
 * Grease in the bearing through the working day: the chosen mode drawn up to
 * the clock, the other mode faint behind it for comparison, and the band
 * that counts as the right amount.
 */
export function GreaseChart({ mode, t, full }: { mode: LubeMode; t: number; full: boolean }) {
  const clip = useId();
  const other: LubeMode = mode === "automatisk" ? "manuell" : "automatisk";
  const level = greaseLevel(mode, t);
  const font = { fontFamily: "var(--font-inter)", fontSize: 13 } as const;
  return (
    <svg viewBox="0 0 520 196" role="img" aria-label="Fettmengde i lageret gjennom arbeidsdagen" className="block h-auto w-full">
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width={full ? 520 : xFor(t)} height="196" />
        </clipPath>
      </defs>
      {/* Zones: too much, right, too little */}
      <rect x={X0} y={Y0} width={X1 - X0} height={yFor(OPTIMAL.high) - Y0} fill="#ffb6c1" opacity="0.22" />
      <rect x={X0} y={yFor(OPTIMAL.high)} width={X1 - X0} height={yFor(OPTIMAL.low) - yFor(OPTIMAL.high)} fill="#ffffff" />
      {[OPTIMAL.high, OPTIMAL.low].map((l) => (
        <line key={l} x1={X0} x2={X1} y1={yFor(l)} y2={yFor(l)} stroke="#e0a7b0" />
      ))}
      <rect x={X0} y={yFor(OPTIMAL.low)} width={X1 - X0} height={Y1 - yFor(OPTIMAL.low)} fill="#ffb6c1" opacity="0.22" />
      <line x1={X0} x2={X1} y1={yFor(100)} y2={yFor(100)} stroke="#cfcfcf" strokeDasharray="4 4" />
      <text x={X1 - 8} y={Y0 + 16} textAnchor="end" fill="#c11e31" fontWeight="600" {...font}>
        For mye
      </text>
      <text x={X1 - 8} y={yFor(100) - 6} textAnchor="end" fill="#444444" fontWeight="600" {...font}>
        Riktig mengde
      </text>
      <text x={X1 - 8} y={Y1 - 8} textAnchor="end" fill="#c11e31" fontWeight="600" {...font}>
        For lite
      </text>
      {/* Hours */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={xFor(f)} x2={xFor(f)} y1={Y1} y2={Y1 + 5} stroke="#919191" />
          <text x={xFor(f)} y={Y1 + 22} textAnchor="middle" fill="#919191" {...font}>
            {`kl. ${String(7 + f * 8).padStart(2, "0")}`}
          </text>
        </g>
      ))}
      <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke="#919191" />
      {/* The other mode, faint; the chosen one, drawn up to the clock */}
      <path d={CURVES[other]} fill="none" stroke={STROKE[other]} strokeWidth="2" strokeLinejoin="round" opacity="0.18" />
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
