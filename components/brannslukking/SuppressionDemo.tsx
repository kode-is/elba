"use client";

import { useEffect, useState } from "react";
import { SYSTEMS, type SystemKind } from "@/lib/brannslukking";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { DemoControl, DemoStatus, DemoSteps, DemoToggle, useOnScreen } from "@/components/demo/Demo";

// One loop of the demo: the tube is pressurised and watching, a fire starts
// on the engine, the tube bursts where the flame touches it, the agent
// discharges (through the burst in the direct system, through the nozzles in
// the indirect one) and the fire goes out. Each phase lights up its step in
// the list beside the drawing.
type Phase = "watch" | "fire" | "burst" | "discharge" | "out";

const TIMELINE: { phase: Phase; ms: number }[] = [
  { phase: "watch", ms: 1800 },
  { phase: "fire", ms: 1700 },
  { phase: "burst", ms: 700 },
  { phase: "discharge", ms: 1900 },
  { phase: "out", ms: 2200 },
];

/** Which of the three steps a phase belongs to. */
const STEP_OF: Record<Phase, number> = { watch: 0, fire: 0, burst: 1, discharge: 2, out: 2 };

const STATUS: Record<Phase, string> = {
  watch: "Trykksatt og klar",
  fire: "Brann i motorrommet",
  burst: "Røret sprekker – trykket faller",
  discharge: "Slukker",
  out: "Brannen er slukket",
};

// Where the flame meets the tube (the burst point), and the nozzles of the
// indirect system's discharge line.
const BURST = { x: 432, y: 168 };
const NOZZLES = [318, 432, 546];

export function SuppressionDemo() {
  const [kind, setKind] = useState<SystemKind>("indirekte");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [run, setRun] = useState(0);
  const reduced = usePrefersReducedMotion();
  // Only animate while the drawing is on screen.
  const { ref, visible } = useOnScreen<HTMLDivElement>();

  useEffect(() => {
    if (!visible || reduced) return;
    const timer = window.setTimeout(
      () => setPhaseIndex((i) => (i + 1) % TIMELINE.length),
      TIMELINE[phaseIndex].ms,
    );
    return () => window.clearTimeout(timer);
  }, [phaseIndex, visible, reduced, run]);

  // Reduced motion: hold a single, fully explained frame instead of looping.
  const phase: Phase = reduced ? "discharge" : TIMELINE[phaseIndex].phase;
  const step = STEP_OF[phase];
  const system = SYSTEMS[kind];
  const burning = phase === "fire" || phase === "burst" || phase === "discharge";
  const burst = phase === "burst" || phase === "discharge" || phase === "out";
  const spraying = phase === "discharge";

  const choose = (next: SystemKind) => {
    setKind(next);
    setPhaseIndex(0);
    setRun((r) => r + 1);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14">
      <div ref={ref} className="relative overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <DemoStatus tone={burning ? "alarm" : "idle"} text={STATUS[phase]} aside={system.label} />

        <svg viewBox="0 0 680 380" role="img" aria-label={`${system.label}: ${system.summary}`} className="block h-auto w-full">
          <defs>
            <radialGradient id="demo-flame" cx="50%" cy="85%" r="70%">
              <stop offset="0%" stopColor="#fff2b3" />
              <stop offset="35%" stopColor="#ffb02e" />
              <stop offset="70%" stopColor="#ff5a1f" />
              <stop offset="100%" stopColor="#c11e31" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="demo-cloud" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#919191" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#b5b5b5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d9d9d9" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="demo-heat" cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="demo-cyl" x1="0" x2="1">
              <stop offset="0%" stopColor="#8f1322" />
              <stop offset="40%" stopColor="#d8293d" />
              <stop offset="100%" stopColor="#8f1322" />
            </linearGradient>
          </defs>

          {/* Engine bay */}
          <rect x="170" y="28" width="486" height="326" rx="18" fill="#f5f2ef" stroke="#e0e0e0" />
          <text x="192" y="56" fill="#919191" fontSize="12" letterSpacing="2.5" fontFamily="var(--font-inter)">
            MOTORROM
          </text>
          {/* Engine block, heads, turbo and exhaust */}
          <rect x="262" y="214" width="250" height="108" rx="12" fill="#ffffff" stroke="#cfcfcf" />
          {[282, 340, 398, 456].map((x) => (
            <rect key={x} x={x} y="194" width="44" height="22" rx="5" fill="#ffffff" stroke="#cfcfcf" />
          ))}
          <circle cx="572" cy="262" r="30" fill="#ffffff" stroke="#cfcfcf" />
          <circle cx="572" cy="262" r="12" fill="#e0e0e0" />
          <path d="M572 232 V150 Q572 130 592 130 H640" fill="none" stroke="#e0e0e0" strokeWidth="14" strokeLinecap="round" />
          <rect x="196" y="248" width="46" height="74" rx="8" fill="#ffffff" stroke="#cfcfcf" />
          <text x="219" y="290" textAnchor="middle" fill="#919191" fontSize="10" fontFamily="var(--font-inter)">
            HYD
          </text>

          {/* Heat haze under the fire */}
          <ellipse
            cx={BURST.x}
            cy="200"
            rx="90"
            ry="60"
            fill="url(#demo-heat)"
            className="transition-opacity duration-700"
            opacity={burning ? 1 : 0}
          />

          {/* Indirect: discharge line and nozzles along the top */}
          <g className="transition-opacity duration-500" opacity={kind === "indirekte" ? 1 : 0}>
            <path d="M118 130 H150 Q160 130 160 120 V78 Q160 68 170 68 H600" fill="none" stroke="#444444" strokeWidth="5" strokeLinecap="round" />
            {NOZZLES.map((x) => (
              <g key={x}>
                <rect x={x - 7} y="68" width="14" height="14" rx="3" fill="#444444" />
                <path d={`M${x - 5} 82 L${x + 5} 82 L${x + 2} 90 L${x - 2} 90 Z`} fill="#919191" />
              </g>
            ))}
          </g>

          {/* Detection tube: enters the bay, loops over the engine. */}
          <path
            d="M104 96 H196 Q210 96 210 110 V154 Q210 168 224 168 H600 Q614 168 614 182 V214"
            fill="none"
            stroke={burst ? "#ffb6c1" : "#c11e31"}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-[stroke] duration-300"
          />
          {/* Pressure moving through the tube while it is intact */}
          {!burst ? (
            <path
              d="M104 96 H196 Q210 96 210 110 V154 Q210 168 224 168 H600 Q614 168 614 182 V214"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="6 42"
              strokeLinecap="round"
              className="animate-tube-flow"
            />
          ) : null}
          {/* The burst: a gap and a few fragments */}
          <g className="transition-opacity duration-200" opacity={burst ? 1 : 0}>
            <rect x={BURST.x - 9} y={BURST.y - 6} width="18" height="12" fill="#f5f2ef" />
            <circle cx={BURST.x - 14} cy={BURST.y - 10} r="2" fill="#c11e31" />
            <circle cx={BURST.x + 15} cy={BURST.y - 12} r="1.6" fill="#c11e31" />
            <circle cx={BURST.x + 4} cy={BURST.y - 16} r="1.4" fill="#ffb6c1" />
          </g>

          {/* Fire on the engine heads */}
          <g
            style={{
              transformOrigin: `${BURST.x}px 212px`,
              transform: `scale(${phase === "fire" ? 0.75 : burning ? 1 : 0})`,
            }}
            className="transition-transform duration-700 ease-out"
          >
            <path
              className="animate-flame"
              d={`M${BURST.x} 150 C${BURST.x + 26} 176 ${BURST.x + 34} 196 ${BURST.x + 20} 214 L${BURST.x - 20} 214 C${BURST.x - 34} 196 ${BURST.x - 22} 178 ${BURST.x - 8} 166 C${BURST.x - 6} 178 ${BURST.x - 2} 184 ${BURST.x + 4} 186 C${BURST.x + 2} 172 ${BURST.x - 4} 162 ${BURST.x} 150 Z`}
              fill="url(#demo-flame)"
            />
          </g>

          {/* Agent: from the burst (direct) or from every nozzle (indirect) */}
          <g className="transition-opacity duration-500" opacity={spraying ? 1 : 0}>
            {kind === "direkte" ? (
              <circle
                cx={BURST.x}
                cy={BURST.y + 18}
                r={spraying ? 78 : 10}
                fill="url(#demo-cloud)"
                className="transition-[r] duration-[1200ms] ease-out"
              />
            ) : (
              NOZZLES.map((x) => (
                <path
                  key={x}
                  d={`M${x} 90 L${x + (spraying ? 58 : 6)} 214 L${x - (spraying ? 58 : 6)} 214 Z`}
                  fill="url(#demo-cloud)"
                  className="transition-[d] duration-[1000ms] ease-out"
                />
              ))
            )}
          </g>

          {/* Cylinder */}
          <rect x="44" y="104" width="76" height="232" rx="34" fill="url(#demo-cyl)" />
          <rect x="66" y="78" width="32" height="30" rx="5" fill="#9a9a9a" />
          <rect x="98" y="88" width="10" height="14" rx="3" fill="#9a9a9a" />
          {/* Pressure gauge: the needle drops when the tube bursts */}
          <circle cx="82" cy="92" r="10" fill="#f4f5f7" stroke="#919191" />
          <line
            x1="82"
            y1="92"
            x2="82"
            y2="84"
            stroke={burst ? "#c11e31" : "#000000"}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transformOrigin: "82px 92px", transform: `rotate(${burst ? -110 : 25}deg)` }}
            className="transition-transform duration-500"
          />
          {/* Product label, kept plain */}
          <rect x="52" y="176" width="60" height="96" rx="6" fill="#000000" />
          <rect x="62" y="196" width="40" height="6" rx="3" fill="#ffffff" />
          <rect x="62" y="210" width="28" height="4" rx="2" fill="#919191" />
          <rect x="62" y="220" width="34" height="4" rx="2" fill="#919191" />
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 pb-1">
          <DemoToggle
            label="Velg system"
            options={(Object.keys(SYSTEMS) as SystemKind[]).map((k) => ({ key: k, label: SYSTEMS[k].label }))}
            value={kind}
            onChange={choose}
          />
          {!reduced ? (
            <DemoControl
              kind="replay"
              onClick={() => {
                setPhaseIndex(0);
                setRun((r) => r + 1);
              }}
            />
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-lead text-ink-muted md:text-lead-lg">{system.summary}</p>
        <div className="mt-8">
          <DemoSteps steps={system.steps} current={reduced ? null : step} />
        </div>
        <p className="mt-8 font-ui text-[15px] font-semibold text-black">Passer best til</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {system.bestFor.map((b) => (
            <li key={b} className="rounded-full bg-white px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium text-ink-muted">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
