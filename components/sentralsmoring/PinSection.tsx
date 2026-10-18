import { GREASE, GREASE_DARK } from "@/components/sentralsmoring/Machine";
import { OPTIMAL } from "@/lib/smoremodell";
import type { LubeMode } from "@/lib/sentralsmoring";

const C = 70;
const HOUSING = 56;
const BORE = 44;
const PIN = 32;

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
 * The bucket pin in its bushing, in section. With central lubrication the
 * grease goes in while the pin turns under load, so the film is even all the
 * way round. Greased parked, the pin rests on its loaded side: right after
 * the gun the grease does reach all the way round, but thick in the free gap
 * and thin where the pin bears — and as the day goes on, that thin side runs
 * dry first while the overflow squeezes out at the seals.
 */
export function PinSection({ mode, level, turn, fresh }: { mode: LubeMode; level: number; turn: number; fresh: number }) {
  const auto = mode === "automatisk";
  const drop = auto ? 0 : 7;
  // How far round the bore the grease still reaches, from the free gap on top.
  const span = auto ? 360 : Math.max(0, Math.min(360, ((level - 20) / 110) * 360));
  const excess = auto ? 0 : Math.max(0, (level - OPTIMAL.high) / 55);
  const dry = auto ? 0 : Math.min(1, Math.max(0, (330 - span) / 150));
  const clip = `pin-grease-${mode}`;
  return (
    <svg viewBox="0 0 140 140" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <clipPath id={clip}>
          <path d={span >= 359.9 ? wedge(-90, 359.9) : wedge(-90, span)} />
        </clipPath>
      </defs>
      <circle cx={C} cy={C} r={HOUSING} fill="#f5f2ef" stroke="#cfcfcf" strokeWidth="2" />
      {/* Grease channel from the nipple at the top */}
      <rect x={C - 4} y={C - HOUSING - 6} width="8" height="18" rx="2" fill="#cfcfcf" />
      <circle cx={C} cy={C} r={BORE} fill="#ffffff" stroke="#cfcfcf" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={BORE - 0.75} fill={GREASE} clipPath={`url(#${clip})`} opacity={auto ? 0.9 : 1} />
      {/* A fresh dose, just in */}
      {fresh > 0 ? (
        <circle cx={C} cy={C} r={BORE - 4} fill="none" stroke="#f6c46f" strokeWidth={6 * fresh} opacity={fresh} />
      ) : null}
      {/* Metal on metal where the pin bears and no grease reaches */}
      <path d={arc(90, 70, BORE - 1)} fill="none" stroke="#c11e31" strokeWidth="4" strokeLinecap="round" opacity={dry} />
      <g transform={`translate(0 ${drop})`}>
        <circle cx={C} cy={C} r={PIN} fill="#ffffff" stroke="#9a9a9a" strokeWidth="2" />
        <line
          x1={C}
          y1={C}
          x2={C}
          y2={C - PIN + 8}
          stroke="#9a9a9a"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${turn} ${C} ${C})`}
        />
        <circle cx={C} cy={C} r="4" fill="#9a9a9a" />
      </g>
      {/* Overflow squeezed out at the seals */}
      {excess > 0
        ? [-1, 1].map((side) => (
            <ellipse
              key={side}
              cx={C + side * (HOUSING - 6)}
              cy={C - 34}
              rx={3 + 9 * excess}
              ry={2 + 6 * excess}
              fill={GREASE}
              stroke={GREASE_DARK}
              strokeWidth="1"
            />
          ))
        : null}
    </svg>
  );
}
