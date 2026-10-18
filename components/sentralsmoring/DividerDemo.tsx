"use client";

import { useState } from "react";
import { DIVIDER_MODES, type DividerMode } from "@/lib/sentralsmoring";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ILL } from "@/lib/illustrasjon";
import { DemoControl, DemoStatus, DemoSteps, DemoToggle, useLoopClock, useOnScreen, useSmallScreen } from "@/components/demo/Demo";

// A progressive divider opened up (schematic): three pistons, six outlets.
// What makes it progressive is that each piston is the valve for the next:
// every bore has an inlet port in the middle and a port either side, and the
// groove round the piston's waist joins the inlet to one side port or the
// other, depending on which end the piston stands at. That side port leads
// to one end of the next piston — A drives B, B drives C, C drives A. So
// grease from the pump pushes one piston at a time to its end stop, the
// grease in front of it goes out of one outlet, and only then is the next
// piston's channel open. A, B, C to the right (outlets 1-3), then back
// (outlets 4-6), and round again. The indicator pin rides on piston A.
//
// In the blocked mode outlet 3 cannot take grease: piston C cannot move, so
// neither can anything after it. The pressure climbs until the relief valve
// on the pump opens, and the indicator pin stands still.
//
// Simplified: the displaced grease is drawn going straight to its outlet;
// in a real block it too is routed past the neighbouring pistons, and the
// outlet numbers stamped on a block need not run in this order.

const MOVE_MS = 1500;
const HOLD_MS = 800;
const STEP_MS = MOVE_MS + HOLD_MS;
const STALL_MS = 2 * STEP_MS;
const RELIEF_MS = STALL_MS + 3200;
const BLOCKED_LOOP_MS = RELIEF_MS + 4500;
const NORMAL_LOOP_MS = 6 * STEP_MS;

const BORES = [118, 190, 262];
const X0 = 170;
const X1 = 430;
const PISTON = 180;
const STROKE = X1 - X0 - PISTON;
const HALF = 16;
const INLET_X = 300;
const PORT = { L: 232, R: 368 };
const LETTERS = ["A", "B", "C"];

/** Move k (0-5): which piston, which way, and which outlet it feeds. */
const MOVES = Array.from({ length: 6 }, (_, k) => ({ piston: k % 3, right: k < 3, outlet: k + 1 }));

const smooth = (v: number) => v * v * (3 - 2 * v);

/** Grease from the pump to the inlet port in the middle of bore `q`. */
function supply(q: number) {
  const y = BORES[q] - HALF;
  if (q === 0) return `M120 28 H${INLET_X} V${y}`;
  const gap = (BORES[q - 1] + HALF + y) / 2;
  return `M120 28 H${INLET_X} V80 H140 V${gap} H${INLET_X} V${y}`;
}

/** From bore `q`'s side port to the end of the next piston that it drives. */
function control(q: number, side: "L" | "R") {
  const x = PORT[side];
  const from = BORES[q] + HALF;
  if (q < 2) {
    const to = BORES[q + 1] - HALF;
    // Port R drives the next piston rightwards (into its left end), port L leftwards (into its right end).
    const end = side === "R" ? X0 + 12 : X1 - 12;
    return `M${x} ${from} L${end} ${to}`;
  }
  // Piston C drives piston A, round the outside of the bores.
  const y = BORES[0] - 8;
  return side === "R" ? `M${x} ${from} V298 H478 V${y} H${X1}` : `M${x} ${from} V304 H122 V${y} H${X0}`;
}

/** Everything the drawing needs at time `ms` into the loop. */
function stateAt(mode: DividerMode, ms: number) {
  const blocked = mode === "blokkert";
  const stalled = blocked && ms >= STALL_MS;
  const k = stalled ? 2 : Math.floor(ms / STEP_MS) % 6;
  const into = stalled ? 0 : ms - k * STEP_MS;
  const moving = !stalled && into < MOVE_MS;
  const progress = stalled ? 0 : smooth(Math.min(1, into / MOVE_MS));
  // Piston positions (0 left end, 1 right end): moves before k are done, move k is under way.
  const pos = [0, 1, 2].map((p) => {
    let x = 0;
    for (let j = 0; j < k; j++) if (MOVES[j].piston === p) x = MOVES[j].right ? 1 : 0;
    if (MOVES[k].piston === p) x = MOVES[k].right ? progress : 1 - progress;
    return x;
  });
  const climb = stalled ? Math.min(1, (ms - STALL_MS) / (RELIEF_MS - STALL_MS)) : 0;
  const relief = blocked && ms >= RELIEF_MS ? Math.min(1, (ms - RELIEF_MS) / 1500) : 0;
  const pressure = stalled ? 0.25 + 0.75 * climb : moving ? 0.3 : 0.12;
  return { move: MOVES[k], moving, progress, pos, stalled, relief, pressure };
}

/** A drilled channel: a pale casing (so crossings read as passing over each other) and the bore. */
function Channel({ d, active, alarm, flow }: { d: string; active: boolean; alarm: boolean; flow: boolean }) {
  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} stroke={ILL.steelLight} strokeWidth="9" />
      <path d={d} stroke={active ? (alarm ? ILL.brand : ILL.grease) : ILL.steelMid} strokeWidth="5" />
      {active && flow ? <path d={d} stroke="#ffffff" strokeWidth="2" strokeDasharray="6 42" className="animate-tube-flow" /> : null}
    </g>
  );
}

export function DividerDemo() {
  const [mode, setMode] = useState<DividerMode>("normal");
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const small = useSmallScreen();
  const { ref, visible } = useOnScreen<HTMLDivElement>();
  const loop = mode === "blokkert" ? BLOCKED_LOOP_MS : NORMAL_LOOP_MS;
  const [ms, setMs] = useLoopClock(visible && !reduced && !paused, loop);

  // Reduced motion: piston B halfway through its stroke, or the stalled block with the valve open.
  const time = reduced ? (mode === "blokkert" ? BLOCKED_LOOP_MS - 1 : STEP_MS + MOVE_MS / 2) : ms;
  const s = stateAt(mode, time);
  const blocked = mode === "blokkert";
  const info = DIVIDER_MODES[mode];
  const k = small ? 1.6 : 1;
  const font = { fontFamily: "var(--font-inter)", fontSize: 13 * k } as const;

  let step: number;
  let status: string;
  if (!blocked) {
    step = s.moving ? 0 : 1;
    status = s.moving
      ? `Stempel ${LETTERS[s.move.piston]} skyver fett ut til utløp ${s.move.outlet}`
      : `Endestopp. Kanalen til stempel ${LETTERS[(s.move.piston + 1) % 3]} er åpen`;
  } else if (!s.stalled) {
    [step, status] = [0, s.moving ? `Stempel ${LETTERS[s.move.piston]} skyver fett ut til utløp ${s.move.outlet}` : "Endestopp. Neste stempel står for tur"];
  } else if (s.relief === 0) {
    [step, status] = [1, "Utløp 3 er tett. Hele fordeleren står"];
  } else {
    [step, status] = [2, "Overtrykksventilen på pumpen åpner"];
  }

  // The live path: supply into the previous piston's bore, through its
  // groove, out of its side port and into the moving (or stuck) piston's end.
  const target = s.move;
  const driver = (target.piston + 2) % 3;
  // The driver's groove joins the inlet to the side port at the end it stands at.
  const side: "L" | "R" = s.pos[driver] > 0.5 ? "R" : "L";
  const pressurised = s.moving || s.stalled;

  const choose = (next: DividerMode) => {
    setMode(next);
    setMs(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-14">
      <div ref={ref} className="overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <DemoStatus tone={s.stalled ? "alarm" : pressurised ? "active" : "idle"} text={status} />

        <svg viewBox="0 0 600 330" role="img" aria-label={`Progressiv fordeler i snitt, forenklet: ${info.summary}`} className="block h-auto w-full">
          <defs>
            <linearGradient id="divider-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ILL.steelLight} />
              <stop offset="100%" stopColor={ILL.steel} />
            </linearGradient>
            <linearGradient id="divider-piston" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#dde2e7" />
              <stop offset="100%" stopColor={ILL.steelMid} />
            </linearGradient>
          </defs>

          {/* The pump, with its relief valve, and a gauge on the line */}
          <rect x="20" y="10" width="100" height="36" rx="6" fill="#1d1d1d" />
          <text x="62" y={33 + (k - 1) * 4} textAnchor="middle" fill="#ffffff" fontWeight="600" {...font}>
            Pumpe
          </text>
          <rect x="100" y="2" width="12" height="10" rx="2" fill={ILL.brand} />
          {s.relief > 0 ? (
            <g opacity={s.relief}>
              <ellipse cx={106 + 8 * s.relief} cy={2 - 4 * s.relief} rx={3 + 7 * s.relief} ry={2 + 4 * s.relief} fill={ILL.grease} stroke={ILL.greaseDark} />
              <text x="130" y={12 + (k - 1) * 4} fill={ILL.brand} fontWeight="600" {...font}>
                Overtrykksventil
              </text>
            </g>
          ) : null}

          {/* The block: three sections, one bore each */}
          <rect x="110" y="66" width="380" height="250" rx="10" fill="url(#divider-steel)" stroke={ILL.steelDark} strokeWidth="2" />
          {[154, 226].map((y) => (
            <line key={y} x1="110" y1={y} x2="490" y2={y} stroke={ILL.steelDark} strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
          ))}

          {/* Channels: the pump line to each bore's inlet port, and each bore's side ports to the next piston */}
          {[0, 1, 2].map((q) => (
            <Channel key={`s${q}`} d={supply(q)} active={pressurised && q === driver} alarm={s.stalled} flow={!reduced} />
          ))}
          {[0, 1, 2].flatMap((q) =>
            (["L", "R"] as const).map((sd) => (
              <Channel key={`c${q}${sd}`} d={control(q, sd)} active={pressurised && q === driver && sd === side} alarm={s.stalled} flow={!reduced} />
            )),
          )}

          {/* Pressure gauge on the pump line */}
          <g transform="translate(210 28)">
            <circle r="13" fill="#ffffff" stroke={ILL.steelDark} strokeWidth="2" />
            <path d="M9.2 -9.2 A13 13 0 0 1 9.2 9.2" fill="none" stroke={ILL.brand} strokeWidth="3" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-9.5"
              stroke={s.pressure > 0.8 ? ILL.brand : "#000000"}
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${Math.round(-135 + 255 * s.pressure)})`}
              className="transition-transform duration-300"
            />
          </g>

          {/* Outlets: 1-3 on the right, 4-6 on the left */}
          {MOVES.map((m) => {
            const y = BORES[m.piston] + 10;
            const right = m.right;
            const from = right ? X1 : X0;
            const end = right ? 536 : 64;
            const delivering = s.moving && target.outlet === m.outlet;
            const isBlocked = blocked && m.outlet === 3;
            const cx = right ? 556 : 44;
            return (
              <g key={m.outlet}>
                <Channel d={`M${from} ${y} H${end}`} active={delivering} alarm={false} flow={false} />
                {delivering
                  ? [0, 0.33, 0.66].map((lag) => (
                      <circle key={lag} cx={Math.round((from + (end - from) * ((s.progress * 1.6 + lag) % 1)) * 10) / 10} cy={y} r="3" fill={ILL.greaseDark} />
                    ))
                  : null}
                {isBlocked ? <rect x={end - 4} y={y - 7} width="8" height="14" rx="2" fill={ILL.brand} /> : null}
                <circle
                  cx={cx}
                  cy={y}
                  r={12 * Math.min(k, 1.3)}
                  fill={isBlocked ? ILL.brand : delivering ? ILL.grease : "#ffffff"}
                  stroke={isBlocked ? ILL.brand : "#000000"}
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                <text x={cx} y={y + 4.5 * k} textAnchor="middle" fill={isBlocked ? "#ffffff" : "#000000"} fontWeight="600" {...font}>
                  {m.outlet}
                </text>
              </g>
            );
          })}

          {BORES.map((y, p) => {
            const px = Math.round((X0 + STROKE * s.pos[p]) * 10) / 10;
            const isMoving = s.moving && target.piston === p;
            const isStuck = s.stalled && target.piston === p;
            const isDriver = pressurised && driver === p;
            const waist = px + PISTON / 2;
            return (
              <g key={p}>
                {/* Bore, full of grease either side of the piston; the end under pressure is lighter */}
                <rect x={X0} y={y - HALF} width={X1 - X0} height={HALF * 2} fill={ILL.grease} opacity="0.9" />
                {isMoving || isStuck ? (
                  <rect
                    x={target.right ? X0 : px + PISTON}
                    y={y - HALF}
                    width={target.right ? px - X0 : X1 - px - PISTON}
                    height={HALF * 2}
                    fill={isStuck ? ILL.brandSoft : ILL.greaseLight}
                  />
                ) : null}
                <rect x={X0} y={y - HALF} width={X1 - X0} height={HALF * 2} fill="none" stroke={ILL.steelDark} strokeWidth="1.5" />
                {/* Piston: two lands and the groove (waist) between them */}
                <g transform={isStuck && !reduced ? `translate(${Math.round(Math.sin(time / 40) * 8) / 10} 0)` : undefined}>
                  <rect x={px} y={y - HALF + 1} width={PISTON / 2 - 45} height={HALF * 2 - 2} rx="3" fill="url(#divider-piston)" stroke={ILL.steelDark} strokeWidth="1.2" />
                  <rect x={waist + 45} y={y - HALF + 1} width={PISTON / 2 - 45} height={HALF * 2 - 2} rx="3" fill="url(#divider-piston)" stroke={ILL.steelDark} strokeWidth="1.2" />
                  <rect x={waist - 45} y={y - 6} width="90" height="12" fill="url(#divider-piston)" stroke={ILL.steelDark} strokeWidth="1" />
                  <rect x={waist - 45} y={y - HALF + 1} width="90" height={HALF - 7} fill={isDriver ? ILL.grease : ILL.steel} />
                  <rect x={waist - 45} y={y + 6} width="90" height={HALF - 7} fill={isDriver ? ILL.grease : ILL.steel} />
                  <text x={px + 22} y={y + 4.5 * k} textAnchor="middle" fill="#000000" fontWeight="600" {...font}>
                    {LETTERS[p]}
                  </text>
                </g>
                {isMoving || isStuck ? (
                  <rect x={px - 1} y={y - HALF - 1} width={PISTON + 2} height={HALF * 2 + 2} rx="4" fill="none" stroke={isStuck ? ILL.brand : "#000000"} strokeWidth="2" />
                ) : null}
              </g>
            );
          })}

          {/* Indicator pin, riding on piston A out through the right-hand end (drawn at less than its travel outside) */}
          {(() => {
            const end = Math.round((X0 + STROKE * s.pos[0] + PISTON) * 10) / 10;
            return (
              <g>
                <rect x={end} y={BORES[0] - 3} width={490 - end} height="6" fill={ILL.steelMid} />
                <rect x="490" y={BORES[0] - 4} width={Math.round((8 + STROKE * s.pos[0] * 0.4) * 10) / 10} height="8" rx="2" fill={ILL.brand} />
                <text x="494" y={BORES[0] - 12} fill={ILL.brand} fontWeight="600" fontFamily="var(--font-inter)" fontSize={11 * k}>
                  Indikatorstift
                </text>
              </g>
            );
          })()}
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 pb-1">
          <DemoToggle
            label="Velg tilstand"
            options={(Object.keys(DIVIDER_MODES) as DividerMode[]).map((m) => ({ key: m, label: DIVIDER_MODES[m].label }))}
            value={mode}
            onChange={choose}
          />
          {!reduced ? <DemoControl kind={paused ? "play" : "pause"} onClick={() => setPaused((p) => !p)} /> : null}
        </div>
        <p className="px-2 pt-2 pb-1 font-ui text-[13px] leading-[1.5] text-ink-muted">
          Forenklet snitt. Kanalene er tegnet utenom boringene, og utløpsnumrene på en ekte fordeler kan gå i en annen rekkefølge.
        </p>
      </div>

      <div>
        <p className="text-lead text-ink-muted md:text-lead-lg">{info.summary}</p>
        <div className="mt-8">
          <DemoSteps steps={info.steps} current={reduced ? null : step} tone="cream" />
        </div>
      </div>
    </div>
  );
}
