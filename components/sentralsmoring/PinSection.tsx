import { ILL } from "@/lib/illustrasjon";
import type { LubeMode } from "@/lib/sentralsmoring";

const C = 70;
const HOUSING = 56;
const BORE = 44;
/** The pin; the clearance is still exaggerated many times over (real clearance is well under 1 % of the diameter). */
const PIN = 38;
/** Under load the pin rests against the lower side of the bushing. */
const DROP = 3.5;

// Rounded, so the server's and the browser's trigonometry render the same markup.
const at = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
};

/** A pie slice from the centre, `span` degrees wide around `mid` (0 = right, 90 = down). */
function wedge(mid: number, span: number, r = 70) {
  const large = span > 180 ? 1 : 0;
  return `M${C} ${C} L${at(r, mid - span / 2)} A${r} ${r} 0 ${large} 1 ${at(r, mid + span / 2)} Z`;
}

function arc(mid: number, span: number, r: number) {
  return `M${at(r, mid - span / 2)} A${r} ${r} 0 0 1 ${at(r, mid + span / 2)}`;
}

/**
 * The bucket pin in its bushing, in section and not to scale. The pin bears
 * on the lower side in both modes. With central lubrication fresh grease
 * keeps coming while the load direction keeps changing, so the film stays
 * whole, thin on the loaded side but never gone. Greased parked, the grease
 * fills the free gap on top and reaches round the pin, thinnest where it
 * bears; through the day it retreats from the loaded side first.
 */
export function PinSection({ mode, level, turn, fresh }: { mode: LubeMode; level: number; turn: number; fresh: number }) {
  const auto = mode === "automatisk";
  // How far round the bore the grease still reaches, from the free gap on top.
  const span = auto ? 360 : Math.max(0, Math.min(360, ((level - 30) / 70) * 360));
  const dry = auto ? 0 : Math.min(1, Math.max(0, (330 - span) / 150));
  const clip = `pin-grease-${mode}`;
  return (
    <svg viewBox="0 0 140 140" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <clipPath id={clip}>
          <path d={wedge(-90, Math.min(span, 359.9))} />
        </clipPath>
      </defs>
      <circle cx={C} cy={C} r={HOUSING} fill={ILL.surface} stroke={ILL.steelMid} strokeWidth="2" />
      {/* Grease channel from the nipple at the top */}
      <rect x={C - 4} y={C - HOUSING - 6} width="8" height="18" rx="2" fill={ILL.steelMid} />
      <circle cx={C} cy={C} r={BORE} fill="#ffffff" stroke={ILL.steelMid} strokeWidth="1.5" />
      <circle cx={C} cy={C} r={BORE - 0.75} fill={ILL.grease} clipPath={`url(#${clip})`} />
      {/* A fresh dose, just in */}
      {fresh > 0 ? <circle cx={C} cy={C} r={BORE - 2} fill="none" stroke={ILL.greaseLight} strokeWidth={4 * fresh} opacity={fresh} /> : null}
      {/* Metal on metal where the pin bears and no grease reaches */}
      <path d={arc(90, 70, BORE - 1)} fill="none" stroke={ILL.brand} strokeWidth="3.5" strokeLinecap="round" opacity={dry} />
      <g transform={`translate(0 ${DROP})`}>
        <circle cx={C} cy={C} r={PIN} fill="#ffffff" stroke={ILL.steelDark} strokeWidth="2" />
        <line
          x1={C}
          y1={C}
          x2={C}
          y2={C - PIN + 8}
          stroke={ILL.steelDark}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${Math.round(turn * 10) / 10} ${C} ${C})`}
        />
        <circle cx={C} cy={C} r="4" fill={ILL.steelDark} />
      </g>
    </svg>
  );
}
