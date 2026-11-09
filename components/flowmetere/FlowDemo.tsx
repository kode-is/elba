"use client";

import { useEffect, useState } from "react";
import { METERS, type MeterKind } from "@/lib/flowmetere";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { DemoControl, DemoStatus, DemoSteps, DemoToggle, useOnScreen } from "@/components/demo/Demo";

// One loop of the demo: the oil system starts cold, warms up to running
// temperature, then the strainer in front of the meter clogs and the flow to
// the bearing drops below the low alarm. The same loop runs for both
// measuring principles; what differs is the meter in the middle — a float in
// a tapered tube (variable area), which reads off while the oil is cold and
// thick, or a pair of oval gears, which count volume and read true at any
// viscosity.
type Phase = "kald" | "drift" | "tett";

const TIMELINE: { phase: Phase; ms: number }[] = [
  { phase: "kald", ms: 3200 },
  { phase: "drift", ms: 2800 },
  { phase: "tett", ms: 3800 },
];

/** L/min actually reaching the bearing in each phase. */
const ACTUAL: Record<Phase, number> = { kald: 4, drift: 4, tett: 1.2 };
/** What the variable-area meter shows on cold, thick oil (illustrative, not a datasheet figure). */
const VA_COLD = 5.2;
const LOW = 2.5;
const HIGH = 7;
const SCALE_MAX = 8;

type Sim = { actual: number; reading: number; angle: number; dash: number; roller: number; t: number };
const START: Sim = { actual: ACTUAL.kald, reading: ACTUAL.kald, angle: 0, dash: 0, roller: 0, t: 0 };

const fmt = (v: number) => v.toFixed(1).replace(".", ",");

const OIL = "#e9a23b";
// The tapered tube: L/min to height, bottom (0) to top (SCALE_MAX).
const TUBE = { cx: 312, bottom: 278, top: 78 };
const tubeY = (lpm: number) => TUBE.bottom - (Math.min(lpm, SCALE_MAX) / SCALE_MAX) * (TUBE.bottom - TUBE.top);

const PIPE_IN: Record<MeterKind, string> = {
  va: "M176 292 H262",
  oval: "M176 292 H252",
};
const PIPE_OUT: Record<MeterKind, string> = {
  va: "M362 62 H574 Q586 62 586 74 V236",
  oval: "M370 212 H574 Q586 212 586 224 V236",
};
const SIGNAL: Record<MeterKind, string> = {
  va: "M390 230 H404 V16 H112 V26",
  oval: "M312 182 V16 H112 V26",
};

export function FlowDemo() {
  const [kind, setKind] = useState<MeterKind>("oval");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [sim, setSim] = useState<Sim>(START);
  const reduced = usePrefersReducedMotion();
  const { ref, visible } = useOnScreen<HTMLDivElement>();

  // Step through the phases while on screen.
  useEffect(() => {
    if (!visible || reduced) return;
    const timer = window.setTimeout(() => setPhaseIndex((i) => (i + 1) % TIMELINE.length), TIMELINE[phaseIndex].ms);
    return () => window.clearTimeout(timer);
  }, [phaseIndex, visible, reduced, run]);

  const phase: Phase = reduced ? "tett" : TIMELINE[phaseIndex].phase;

  // Ease the flow and the reading towards the phase's values, and turn the
  // gears, the oil in the pipes and the bearing.
  useEffect(() => {
    if (!visible || reduced) return;
    const target = ACTUAL[phase];
    const targetReading = kind === "va" && phase === "kald" ? VA_COLD : target;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.max(0, Math.min(64, now - last)) / 1000;
      last = Math.max(last, now);
      setSim((s) => {
        const actual = s.actual + (target - s.actual) * Math.min(1, dt * 1.4);
        return {
          actual,
          reading: s.reading + (targetReading - s.reading) * Math.min(1, dt * 1.8),
          angle: (s.angle + actual * 45 * dt) % 360,
          dash: (s.dash + actual * 14 * dt) % 480,
          roller: (s.roller + 40 * dt) % 360,
          t: s.t + dt,
        };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, phase, kind]);

  // Reduced motion: hold one fully explained frame — the alarm.
  const s: Sim = reduced ? { ...START, actual: ACTUAL.tett, reading: ACTUAL.tett } : sim;
  const meter = METERS[kind];
  const low = s.reading < LOW;
  const high = s.reading > HIGH;
  const alarm = phase === "tett" && low;
  const clog = Math.max(0, Math.min(1, (ACTUAL.drift - s.actual) / (ACTUAL.drift - ACTUAL.tett)));
  const blink = Math.floor(s.t * 2) % 2 === 0;
  const pulse = Math.floor(s.angle / 45) % 2 === 0;
  const cold = phase === "kald";

  const status =
    phase === "kald"
      ? kind === "va"
        ? "Kald oppstart – måleren viser for mye"
        : "Kald oppstart – måleren viser riktig"
      : phase === "drift"
        ? "I drift – oljen når lageret"
        : alarm
          ? "Lav strøm – alarm til kontrollrommet"
          : "Silen tetter seg";

  const choose = (next: MeterKind) => {
    setKind(next);
    setPhaseIndex(0);
    setSim(START);
    setRun((r) => r + 1);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14">
      <div ref={ref} className="relative overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <DemoStatus
          tone={alarm ? "alarm" : phase === "tett" ? "active" : "idle"}
          text={status}
          aside={`Faktisk ${fmt(s.actual)} L/min`}
        />

        <svg
          viewBox="0 0 680 380"
          role="img"
          aria-label={`${meter.label}: ${meter.summary}`}
          className="block h-auto w-full"
        >
          <defs>
            <radialGradient id="flow-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c11e31" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#c11e31" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Display */}
          <rect x="26" y="26" width="172" height="98" rx="12" fill="#111111" />
          <text x="42" y="48" fill="#919191" fontSize="10" letterSpacing="2" fontFamily="var(--font-inter)">
            DISPLAY
          </text>
          <text x="42" y="88" fill="#ffffff" fontSize="34" fontWeight="600" fontFamily="var(--font-inter)" className="tabular-nums">
            {fmt(s.reading)}
          </text>
          <text x="112" y="88" fill="#919191" fontSize="12" fontFamily="var(--font-inter)">
            L/min
          </text>
          <circle cx="46" cy="108" r="4" fill={alarm ? "#c11e31" : "#2e9e5b"} opacity={alarm && !blink ? 0.35 : 1} />
          <text x="56" y="112" fill={alarm ? "#ff8a96" : "#d9d9d9"} fontSize="10" fontWeight="600" fontFamily="var(--font-inter)">
            {alarm ? "LAV STRØM" : "OK"}
          </text>
          <text x="186" y="48" textAnchor="end" fill="#919191" fontSize="9" fontFamily="var(--font-inter)">
            {`Lav ${fmt(LOW)} · Høy ${fmt(HIGH)}`}
          </text>

          {/* Signal cable from the meter to the display */}
          <path d={SIGNAL[kind]} fill="none" stroke="#919191" strokeWidth="2" strokeDasharray="4 4" />

          {/* Oil unit: tank, pump and temperature */}
          <rect x="26" y="170" width="150" height="180" rx="14" fill="#f5f2ef" stroke="#e0e0e0" />
          <text x="42" y="194" fill="#919191" fontSize="10" letterSpacing="2" fontFamily="var(--font-inter)">
            OLJESENTRAL
          </text>
          <rect x="34" y="262" width="134" height="80" rx="8" fill={OIL} opacity="0.3" />
          <circle cx="150" cy="292" r="16" fill="#ffffff" stroke="#cfcfcf" />
          <path d="M142 292 h16 M150 284 v16" stroke="#919191" strokeWidth="2" />
          <rect x="42" y="208" width="8" height="40" rx="4" fill="#ffffff" stroke="#cfcfcf" />
          <rect
            x="44"
            y={cold ? 236 : 216}
            width="4"
            height={cold ? 10 : 30}
            rx="2"
            fill={cold ? "#919191" : "#c11e31"}
            className="transition-all duration-700"
          />
          <text x="58" y="234" fill="#000000" fontSize="16" fontWeight="600" fontFamily="var(--font-inter)">
            {cold ? "15 °C" : "55 °C"}
          </text>
          <text x="58" y="250" fill="#919191" fontSize="10" fontFamily="var(--font-inter)">
            {cold ? "kald, tykk olje" : "driftstemperatur"}
          </text>

          {/* Pipes, with the oil moving at the actual flow */}
          {[PIPE_IN[kind], PIPE_OUT[kind]].map((d) => (
            <g key={d}>
              <path d={d} fill="none" stroke={OIL} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d={d}
                fill="none"
                stroke="#fff3dc"
                strokeWidth="2.5"
                strokeDasharray="6 18"
                strokeDashoffset={-s.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}

          {/* Strainer in front of the meter: clogs in the last phase */}
          <rect x="198" y="278" width="30" height="28" rx="5" fill="#ffffff" stroke="#919191" />
          {[206, 213, 220].map((x) => (
            <line key={x} x1={x} y1="282" x2={x} y2="302" stroke="#cfcfcf" strokeWidth="1.5" />
          ))}
          <g opacity={clog}>
            {[
              [204, 285],
              [211, 297],
              [219, 288],
              [223, 299],
              [208, 292],
              [216, 283],
              [214, 302],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#444444" />
            ))}
          </g>
          <text x="213" y="324" textAnchor="middle" fill={clog > 0.5 ? "#c11e31" : "#919191"} fontSize="10" fontWeight="600" fontFamily="var(--font-inter)">
            {clog > 0.5 ? "TETT" : "SIL"}
          </text>

          {kind === "va" ? (
            <g>
              {/* Variable-area meter: frame, end blocks, tapered tube, float */}
              <rect x="262" y="50" width="100" height="256" rx="8" fill="#f4f5f7" stroke="#cfcfcf" />
              <rect x="262" y="50" width="100" height="24" rx="6" fill="#e0e0e0" />
              <rect x="262" y="282" width="100" height="24" rx="6" fill="#e0e0e0" />
              <path
                d={`M${TUBE.cx - 9} ${TUBE.bottom} L${TUBE.cx - 16} ${TUBE.top} H${TUBE.cx + 16} L${TUBE.cx + 9} ${TUBE.bottom} Z`}
                fill="#ffffff"
                stroke="#919191"
              />
              <path
                d={`M${TUBE.cx - 9} ${TUBE.bottom} L${TUBE.cx - 16} ${TUBE.top} H${TUBE.cx + 16} L${TUBE.cx + 9} ${TUBE.bottom} Z`}
                fill={OIL}
                opacity="0.18"
              />
              {[0, 2, 4, 6, 8].map((v) => (
                <g key={v}>
                  <line x1="282" y1={tubeY(v)} x2="292" y2={tubeY(v)} stroke="#919191" />
                  <text x="279" y={tubeY(v) + 4} textAnchor="end" fill="#919191" fontSize="10" fontFamily="var(--font-inter)">
                    {v}
                  </text>
                </g>
              ))}
              {/* Alarm givers clipped to the tube */}
              {[
                { v: LOW, label: "LAV", on: low },
                { v: HIGH, label: "HØY", on: high },
              ].map((a) => (
                <g key={a.label}>
                  <rect x="331" y={tubeY(a.v) - 5} width="14" height="10" rx="2" fill={a.on ? "#c11e31" : "#444444"} />
                  <text x="348" y={tubeY(a.v) + 3} fill="#444444" fontSize="8" fontWeight="600" fontFamily="var(--font-inter)">
                    {a.label}
                  </text>
                </g>
              ))}
              {/* Float */}
              <g style={{ transform: `translateY(${tubeY(s.reading)}px)` }}>
                <path d={`M${TUBE.cx - 11} -5 H${TUBE.cx + 11} L${TUBE.cx + 4} 7 H${TUBE.cx - 4} Z`} fill="#000000" />
                <line x1={TUBE.cx - 13} y1="-5" x2={TUBE.cx + 13} y2="-5" stroke="#c11e31" strokeWidth="2" />
              </g>
              {/* Smart transmitter with its three alarm lights */}
              <rect x="362" y="196" width="28" height="74" rx="6" fill="#ffffff" stroke="#cfcfcf" />
              <circle cx="376" cy="212" r="4.5" fill="#2e9e5b" opacity={!low && !high && blink ? 1 : 0.18} />
              <circle cx="376" cy="233" r="4.5" fill="#e9a23b" opacity={high ? 1 : 0.18} />
              <circle cx="376" cy="254" r="4.5" fill="#c11e31" opacity={low ? 1 : 0.18} />
            </g>
          ) : (
            <g>
              {/* Oval gear meter: block, clear cover, two meshing gears, pulse sensor */}
              <rect x="252" y="190" width="118" height="120" rx="12" fill="#e0e0e0" />
              <rect x="258" y="196" width="106" height="108" rx="9" fill="#fff8ec" stroke="#cfcfcf" />
              {[
                { cx: 288, rot: s.angle },
                { cx: 336, rot: 90 - s.angle },
              ].map((g) => (
                <g key={g.cx} style={{ transform: `translate(${g.cx}px, 250px) rotate(${g.rot}deg)` }}>
                  <ellipse rx="30" ry="18" fill="#d9d9d9" stroke="#919191" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle r="4" fill="#919191" />
                  <circle cx="20" r="3" fill="#c11e31" />
                </g>
              ))}
              <rect x="302" y="176" width="20" height="14" rx="3" fill="#444444" />
              <circle cx="312" cy="183" r="3" fill={pulse ? "#e9a23b" : "#919191"} />
              <text x="330" y="186" fill="#919191" fontSize="9" fontFamily="var(--font-inter)">
                pulser
              </text>
            </g>
          )}

          {/* Bearing: a roll end turning in its housing */}
          <circle cx="586" cy="292" r="80" fill="url(#flow-heat)" opacity={alarm ? 1 : 0} className="transition-opacity duration-700" />
          <circle cx="586" cy="292" r="56" fill="#ffffff" stroke="#cfcfcf" />
          <g style={{ transform: `translate(586px, 292px) rotate(${s.roller}deg)` }}>
            <circle r="36" fill="none" stroke="#e0e0e0" strokeWidth="8" />
            {Array.from({ length: 8 }, (_, i) => (
              <circle
                key={i}
                cx={36 * Math.cos((i * Math.PI) / 4)}
                cy={36 * Math.sin((i * Math.PI) / 4)}
                r="6"
                fill="#919191"
              />
            ))}
            <circle r="16" fill="#e0e0e0" />
          </g>
          <text x="586" y="370" textAnchor="middle" fill="#919191" fontSize="10" letterSpacing="2" fontFamily="var(--font-inter)">
            LAGER
          </text>
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 pb-1">
          <DemoToggle
            label="Velg måleprinsipp"
            options={(Object.keys(METERS) as MeterKind[]).map((k) => ({ key: k, label: METERS[k].label }))}
            value={kind}
            onChange={choose}
          />
          {!reduced ? (
            <DemoControl
              kind="replay"
              onClick={() => {
                setPhaseIndex(0);
                setSim(START);
                setRun((r) => r + 1);
              }}
            />
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-lead text-ink-muted md:text-lead-lg">{meter.summary}</p>
        <div className="mt-8">
          <DemoSteps steps={meter.steps} current={reduced ? null : phaseIndex} />
        </div>
      </div>
    </div>
  );
}
