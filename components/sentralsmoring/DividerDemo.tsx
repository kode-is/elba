"use client";

import { useEffect, useRef, useState } from "react";
import { DIVIDER_MODES, type DividerMode } from "@/lib/sentralsmoring";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// A progressive divider opened up: three pistons in three sections, six
// outlets. Grease from the pump pushes one piston to its end stop; the grease
// in front of it goes out through one outlet, and only then is the channel to
// the next piston open. A, B, C to the right (outlets 1-3), then A, B, C back
// (outlets 4-6), and round again. The indicator pin rides on piston A.
//
// In the blocked mode outlet 3 cannot take grease: piston C cannot move, so
// neither can anything after it. The pressure climbs until the relief valve
// opens, and the indicator pin stands still — that is how the fault shows.
//
// The channels are drawn schematically (pressure galleries round the bores);
// in the real block they run through the bores and the piston lands open and
// close them, which is what makes the sequence strict.

const MOVE_MS = 1500;
const HOLD_MS = 700;
const STEP_MS = MOVE_MS + HOLD_MS;
/** Blocked mode: two good strokes, then the stall, the climb and the relief valve. */
const STALL_MS = 2 * STEP_MS;
const RELIEF_MS = STALL_MS + 3200;
const BLOCKED_LOOP_MS = RELIEF_MS + 4200;
const NORMAL_LOOP_MS = 6 * STEP_MS;

const BORES = [100, 170, 240];
const BORE_X0 = 165;
const BORE_X1 = 435;
const PISTON = 190;
const STROKE = BORE_X1 - BORE_X0 - PISTON;
const LETTERS = ["A", "B", "C"];
const GREASE = "#e9a23b";
const GREASE_DARK = "#b9741c";
const STEEL_DARK = "#6f7882";

/** Move k (0-5): which piston, which way, and which outlet it feeds. */
const MOVES = Array.from({ length: 6 }, (_, k) => ({
  piston: k % 3,
  right: k < 3,
  outlet: k + 1,
}));

const smooth = (v: number) => v * v * (3 - 2 * v);

/** Everything the drawing needs at time `ms` into the loop. */
function stateAt(mode: DividerMode, ms: number) {
  const blocked = mode === "blokkert";
  const stalled = blocked && ms >= STALL_MS;
  const k = stalled ? 2 : Math.floor(ms / STEP_MS) % 6;
  const into = stalled ? 0 : ms - k * STEP_MS;
  const moving = !stalled && into < MOVE_MS;
  const progress = stalled ? 0 : smooth(Math.min(1, into / MOVE_MS));
  // Piston positions (0 left, 1 right): moves before k are done, move k is under way.
  const pos = [0, 1, 2].map((p) => {
    let x = 0;
    for (let j = 0; j < k; j++) if (MOVES[j].piston === p) x = MOVES[j].right ? 1 : 0;
    if (MOVES[k].piston === p) x = MOVES[k].right ? progress : 1 - progress;
    return x;
  });
  const climb = stalled ? Math.min(1, (ms - STALL_MS) / (RELIEF_MS - STALL_MS)) : 0;
  const relief = blocked && ms >= RELIEF_MS ? Math.min(1, (ms - RELIEF_MS) / 1500) : 0;
  const pressure = stalled ? 0.25 + 0.75 * climb : moving ? 0.3 : 0.12;
  return { k, move: MOVES[k], moving, progress, pos, stalled, climb, relief, pressure };
}

export function DividerDemo() {
  const [mode, setMode] = useState<DividerMode>("normal");
  const [ms, setMs] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced || paused) return;
    let frame = 0;
    let last = performance.now();
    const loop = mode === "blokkert" ? BLOCKED_LOOP_MS : NORMAL_LOOP_MS;
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setMs((m) => (m + dt) % loop);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, paused, mode]);

  // Reduced motion: piston B halfway through its stroke, or the stalled block with the valve open.
  const time = reduced ? (mode === "blokkert" ? BLOCKED_LOOP_MS - 1 : STEP_MS + MOVE_MS / 2) : ms;
  const s = stateAt(mode, time);
  const blocked = mode === "blokkert";
  const info = DIVIDER_MODES[mode];

  let step: number;
  let status: string;
  if (!blocked) {
    step = s.moving ? (s.move.piston === 0 ? 2 : 0) : 1;
    status = s.moving
      ? `Stempel ${LETTERS[s.move.piston]} skyver fett ut til utløp ${s.move.outlet}`
      : `Endestopp – kanalen til stempel ${LETTERS[(s.move.piston + 1) % 3]} åpnes`;
  } else if (!s.stalled) {
    [step, status] = [0, s.moving ? `Stempel ${LETTERS[s.move.piston]} skyver fett ut til utløp ${s.move.outlet}` : "Endestopp – neste stempel står for tur"];
  } else if (s.relief === 0) {
    [step, status] = [1, "Utløp 3 er tett – stempel C står, og alt bak det"];
  } else {
    [step, status] = [2, "Overtrykksventilen åpner – feilen er synlig"];
  }

  // The pressure path from the inlet to the chamber behind the piston that is moving (or stuck).
  const target = s.move;
  const yc = BORES[target.piston];
  const side = target.right ? 142 : 458;
  const into = target.right ? BORE_X0 + 2 : BORE_X1 - 2;
  const pressurePath = `M300 18 V66 H${side} V${yc - 10} H${into}`;
  const pressurised = s.moving || s.stalled;

  const choose = (next: DividerMode) => {
    setMode(next);
    setMs(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-14">
      <div ref={ref} className="overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <div className="mb-2 flex items-center gap-2.5 px-2 pt-1">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300 ${
              s.stalled ? "animate-pulse bg-brand" : pressurised ? "bg-[#e9a23b]" : "bg-black"
            }`}
          />
          <span className="truncate font-ui text-[13px] font-semibold text-black md:text-[14px]">{status}</span>
        </div>

        <svg viewBox="0 0 600 330" role="img" aria-label={`Progressiv fordeler i snitt: ${info.summary}`} className="block h-auto w-full">
          <defs>
            <linearGradient id="divider-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9edf1" />
              <stop offset="100%" stopColor="#c5ccd4" />
            </linearGradient>
            <linearGradient id="divider-piston" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#dde2e7" />
              <stop offset="100%" stopColor="#a9b1ba" />
            </linearGradient>
          </defs>

          {/* Inlet from the pump, with the relief valve and a pressure gauge */}
          <text x="300" y="12" textAnchor="middle" fill="#444444" fontSize="12" fontFamily="var(--font-inter)">
            Fra pumpen
          </text>
          <line x1="300" y1="16" x2="300" y2="52" stroke={STEEL_DARK} strokeWidth="6" />
          <g>
            <rect x="226" y="24" width="28" height="16" rx="3" fill="#9aa3ad" />
            <line x1="254" y1="32" x2="297" y2="32" stroke={STEEL_DARK} strokeWidth="4" />
            {s.relief > 0 ? (
              <g>
                <ellipse cx={222 - 10 * s.relief} cy={34 + 6 * s.relief} rx={4 + 9 * s.relief} ry={3 + 6 * s.relief} fill={GREASE} stroke={GREASE_DARK} />
                <text x="214" y="12" textAnchor="middle" fill="#c11e31" fontSize="12" fontWeight="600" fontFamily="var(--font-inter)" opacity={s.relief}>
                  Overtrykk
                </text>
              </g>
            ) : null}
          </g>
          <g transform="translate(352 32)">
            <line x1="-52" y1="0" x2="-14" y2="0" stroke={STEEL_DARK} strokeWidth="4" />
            <circle r="15" fill="#ffffff" stroke={STEEL_DARK} strokeWidth="2" />
            <path d="M-10.6 10.6 A15 15 0 0 1 -15 0" fill="none" stroke="#e0e0e0" strokeWidth="3" />
            <path d="M10.6 -10.6 A15 15 0 0 1 10.6 10.6" fill="none" stroke="#c11e31" strokeWidth="3" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-11"
              stroke={s.pressure > 0.8 ? "#c11e31" : "#000000"}
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${-135 + 255 * s.pressure})`}
              className="transition-transform duration-300"
            />
          </g>

          {/* The block: three sections, one bore each */}
          <rect x="120" y="50" width="360" height="240" rx="10" fill="url(#divider-steel)" stroke={STEEL_DARK} strokeWidth="2" />
          {[135, 205].map((y) => (
            <line key={y} x1="120" y1={y} x2="480" y2={y} stroke={STEEL_DARK} strokeWidth="1.2" strokeDasharray="6 4" />
          ))}

          {/* Pressure galleries; the live one carries grease to the piston's back */}
          <path d={`M142 66 H458 M142 66 V${BORES[2] - 10} M458 66 V${BORES[2] - 10}`} fill="none" stroke="#9aa3ad" strokeWidth="5" strokeLinecap="round" />
          {BORES.map((y) => (
            <path key={y} d={`M142 ${y - 10} H${BORE_X0} M458 ${y - 10} H${BORE_X1}`} stroke="#9aa3ad" strokeWidth="5" />
          ))}
          {pressurised ? (
            <g>
              <path d={pressurePath} fill="none" stroke={s.stalled ? "#c11e31" : GREASE} strokeWidth="5" strokeLinejoin="round" />
              {!reduced ? (
                <path d={pressurePath} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 42" strokeLinecap="round" className="animate-tube-flow" />
              ) : null}
            </g>
          ) : null}

          {BORES.map((y, p) => {
            const px = BORE_X0 + STROKE * s.pos[p];
            const isMoving = s.moving && target.piston === p;
            const isStuck = s.stalled && target.piston === p;
            return (
              <g key={p}>
                {/* Bore, full of grease either side of the piston; the side under pressure is lighter */}
                <rect x={BORE_X0} y={y - 16} width={BORE_X1 - BORE_X0} height="32" fill={GREASE} opacity="0.9" />
                {isMoving || isStuck ? (
                  <rect
                    x={target.right ? BORE_X0 : px + PISTON}
                    y={y - 16}
                    width={target.right ? px - BORE_X0 : BORE_X1 - px - PISTON}
                    height="32"
                    fill={isStuck ? "#f4b8b8" : "#f8d48f"}
                  />
                ) : null}
                <rect x={BORE_X0} y={y - 16} width={BORE_X1 - BORE_X0} height="32" fill="none" stroke={STEEL_DARK} strokeWidth="1.5" />
                {/* Piston with its lands */}
                <g transform={isStuck && !reduced ? `translate(${Math.sin(time / 40) * 0.8} 0)` : undefined}>
                  <rect x={px} y={y - 15} width={PISTON} height="30" rx="3" fill="url(#divider-piston)" stroke={STEEL_DARK} strokeWidth="1.2" />
                  {[0.22, 0.5, 0.78].map((f) => (
                    <rect key={f} x={px + PISTON * f - 7} y={y - 15} width="14" height="30" fill="#9aa3ad" opacity="0.55" />
                  ))}
                  <text x={px + PISTON / 2} y={y + 5} textAnchor="middle" fill="#000000" fontSize="14" fontWeight="600" fontFamily="var(--font-inter)">
                    {LETTERS[p]}
                  </text>
                </g>
                {isMoving || isStuck ? (
                  <rect x={px - 1} y={y - 17} width={PISTON + 2} height="34" rx="4" fill="none" stroke={isStuck ? "#c11e31" : "#000000"} strokeWidth="2" />
                ) : null}
              </g>
            );
          })}

          {/* Indicator pin, riding on piston A out through the right-hand end */}
          {(() => {
            const end = BORE_X0 + STROKE * s.pos[0] + PISTON;
            return (
              <g>
                <rect x={end} y={BORES[0] - 3} width={480 - end} height="6" fill="#9aa3ad" />
                {/* Shown at about half its travel outside, so it clears outlet 1's label */}
                <rect x="480" y={BORES[0] - 4} width={8 + STROKE * s.pos[0] * 0.45} height="8" rx="2" fill="#c11e31" />
                <text x="492" y={BORES[0] - 12} fill="#c11e31" fontSize="11" fontWeight="600" fontFamily="var(--font-inter)">
                  Indikatorstift
                </text>
              </g>
            );
          })()}

          {/* Outlets: 1-3 on the right, 4-6 on the left */}
          {MOVES.map((m) => {
            const y = BORES[m.piston] + 10;
            const right = m.right;
            const wall = right ? 480 : 120;
            const end = right ? 528 : 72;
            const delivering = s.moving && target.outlet === m.outlet;
            const isBlocked = blocked && m.outlet === 3;
            const dots = delivering ? [0, 0.33, 0.66].map((lag) => (s.progress * 1.6 + lag) % 1) : [];
            const from = right ? BORE_X1 : BORE_X0;
            return (
              <g key={m.outlet}>
                <line x1={from} y1={y} x2={end} y2={y} stroke="#ffffff" strokeWidth="8" />
                <line x1={from} y1={y} x2={end} y2={y} stroke={delivering ? GREASE : "#9aa3ad"} strokeWidth="5" />
                {dots.map((f, i) => (
                  <circle key={i} cx={from + (end - from) * f} cy={y} r="3" fill={GREASE_DARK} />
                ))}
                {isBlocked ? (
                  <g>
                    <rect x={end - 4} y={y - 7} width="8" height="14" rx="2" fill="#c11e31" />
                  </g>
                ) : null}
                <circle
                  cx={right ? 548 : 52}
                  cy={y}
                  r="12"
                  fill={isBlocked ? "#c11e31" : delivering ? GREASE : "#ffffff"}
                  stroke={isBlocked ? "#c11e31" : "#000000"}
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                <text x={right ? 548 : 52} y={y + 4.5} textAnchor="middle" fill={isBlocked ? "#ffffff" : "#000000"} fontSize="13" fontWeight="600" fontFamily="var(--font-inter)">
                  {m.outlet}
                </text>
                <line x1={wall} y1={y - 8} x2={wall} y2={y + 8} stroke={STEEL_DARK} strokeWidth="1" />
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 pb-1">
          <div className="flex flex-wrap gap-3" role="group" aria-label="Velg tilstand">
            {(Object.keys(DIVIDER_MODES) as DividerMode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => choose(m)}
                className={`rounded-full border px-5 py-2 text-[16px] leading-[1.2] font-semibold transition ${
                  mode === m ? "border-brand bg-brand text-white" : "border-neutral-300 text-black hover:border-brand hover:text-brand"
                }`}
              >
                {DIVIDER_MODES[m].label}
              </button>
            ))}
          </div>
          {!reduced ? (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="flex items-center gap-2 rounded-full px-3 py-2 font-ui text-[14px] font-semibold text-brand transition hover:underline"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                {paused ? <path d="M7 5v14l12-7z" /> : <path d="M7 5h3v14H7zM14 5h3v14h-3z" />}
              </svg>
              {paused ? "Spill av" : "Pause"}
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-lead text-ink-muted md:text-lead-lg">{info.summary}</p>
        <ol className="mt-8 space-y-3">
          {info.steps.map((st, i) => (
            <li
              key={st.heading}
              aria-current={!reduced && step === i ? "step" : undefined}
              className={`flex gap-4 rounded-[20px] border-2 bg-white p-5 transition-colors duration-500 ${
                !reduced && step === i ? "border-brand" : "border-transparent"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold transition-colors duration-500 ${
                  !reduced && step === i ? "bg-brand text-white" : "bg-surface text-brand"
                }`}
              >
                {i + 1}
              </span>
              <div>
                <h4 className="font-ui text-label font-semibold text-black md:text-label-lg">{st.heading}</h4>
                <p className="mt-1 font-ui text-body text-ink-muted md:text-body-lg">{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
