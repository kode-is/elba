"use client";

import { useEffect, useRef, useState } from "react";
import { LUBE_POINTS, MAIN_POINTS, MODES, SECONDARY_POINTS, type LubeMode } from "@/lib/sentralsmoring";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import {
  clockLabel,
  CYCLE,
  cycleAt,
  DAY_MS,
  FEED_LINE,
  FIRST_CYCLE,
  GREASE_END,
  GREASE_START,
  greaseLevel,
  gunAt,
  LINES,
  lineArrived,
  lineTravel,
  MANUAL_LEFT,
  OPTIMAL,
  PERIOD,
  phaseOf,
  poseAt,
  type CyclePhase,
} from "@/lib/smoremodell";
import { along, Arm, Body, Dividers, FEED, GREASE, GREASE_DARK, GreaseGun, GROUND, LINE, polyline, Pump, PUMP_AT, routes } from "@/components/sentralsmoring/Machine";
import { GreaseChart } from "@/components/sentralsmoring/GreaseChart";
import { PinSection } from "@/components/sentralsmoring/PinSection";

// One loop is one working day, about a minute long. With central lubrication
// the excavator digs all day; every so often the pump runs, the main divider
// on the upper frame serves its points one after another and sends a dose up
// the boom, and the secondary divider there serves stick and bucket. With the
// grease gun the machine is parked for one big round at the start of the day,
// then digs on what it got. The chart keeps score; the pin section shows where
// the grease ends up. Under reduced motion each mode holds one explained frame.

/** Every line that ends at a lubrication point (the feed to the secondary divider does not). */
const POINT_LINES = Array.from({ length: LINES }, (_, i) => i).filter((i) => i !== FEED_LINE);
const BUCKET_PIN = LUBE_POINTS.indexOf("Skuffebolt");

/** Still frames for reduced motion: grease on its way to stick and bucket, and a dry afternoon. */
const STILL: Record<LubeMode, number> = {
  automatisk: FIRST_CYCLE + 2 * PERIOD + 0.78 * CYCLE,
  manuell: 0.85,
};

const AUTO_STATUS: Record<CyclePhase, string> = {
  idle: "Graver – alle punkter smurt",
  pump: "EP-1 pumper fett til hovedfordeleren",
  main: "Hovedfordeleren doserer – overvogn og bom",
  secondary: "Sekundærfordeleren doserer – stikke og skuffe",
};

export function LubricationDemo() {
  const [mode, setMode] = useState<LubeMode>("automatisk");
  const [clock, setClock] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Only animate while the drawing is on screen.
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
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setClock((c) => (c + dt / DAY_MS) % 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, paused]);

  const t = reduced ? STILL[mode] : clock;
  const auto = mode === "automatisk";
  const pose = poseAt(mode, t);
  const level = greaseLevel(mode, t);
  const u = auto ? cycleAt(t).u : null;
  const phase = phaseOf(u);
  const lines = routes(pose);

  // The manual round: which points the gun has done, and which it is on.
  const gun = auto ? null : gunAt(t, POINT_LINES.length);
  const greased = (k: number) => t >= GREASE_END || (gun !== null && k < gun);
  const pointLevel = (k: number) => (auto || greased(k) ? level : MANUAL_LEFT);

  let step: number;
  let status: string;
  if (auto) {
    step = phase === "pump" ? 0 : phase === "idle" ? 2 : 1;
    status = AUTO_STATUS[phase];
  } else if (t < GREASE_END) {
    step = 0;
    status = t < GREASE_START ? "Parkert – klar for fettpressen" : "Smører med fettpresse i stå-posisjon";
  } else if (level > OPTIMAL.high) [step, status] = [1, "For mye fett – presses ut"];
  else if (level >= OPTIMAL.low) [step, status] = [2, "Graver – fettet tynnes ut"];
  else [step, status] = [2, "For lite fett – slitasje"];

  const alarm = !auto && level < OPTIMAL.low;
  const system = MODES[mode];
  const points = POINT_LINES.map((i) => lines[i][lines[i].length - 1]);
  const pinPulse = lineArrived(u, POINT_LINES[BUCKET_PIN]);
  const fresh = pinPulse === null ? 0 : Math.sin(Math.PI * pinPulse);
  const pinLevel = pointLevel(BUCKET_PIN);

  const choose = (next: LubeMode) => {
    setMode(next);
    setClock(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-12">
      <div ref={ref} className="relative overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <div className="mb-2 flex items-center justify-between gap-3 px-2 pt-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300 ${
                alarm ? "animate-pulse bg-brand" : phase !== "idle" ? "bg-[#e9a23b]" : "bg-black"
              }`}
            />
            <span className="truncate font-ui text-[13px] font-semibold text-black md:text-[14px]">{status}</span>
          </div>
          <span className="shrink-0 font-ui text-[13px] text-ink-muted tabular-nums">kl. {clockLabel(t)}</span>
        </div>

        <svg viewBox="14 24 720 412" role="img" aria-label={`${system.label}: ${system.summary}`} className="block h-auto w-full">
          <path d={GROUND.fill} fill="#f5f2ef" />
          <path d={GROUND.surface} fill="none" stroke="#d6d1ca" strokeWidth="2" />

          <Body />
          <Arm pose={pose} />

          {/* The lubrication system: only on the machine that has one */}
          <g className="transition-opacity duration-500" opacity={auto ? 1 : 0}>
            <path d={polyline(FEED)} fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            <path d={polyline(FEED)} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
            {lines.map((r, i) => (
              <g key={i}>
                <path d={polyline(r)} fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
                <path d={polyline(r)} fill="none" stroke={LINE} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
              </g>
            ))}
            <Dividers pose={pose} main={phase === "main"} secondary={phase === "secondary"} />
            <Pump x={PUMP_AT.x} y={PUMP_AT.y} level={0.82 - 0.16 * t} stir={phase === "pump" && u !== null ? u * 1600 : 0} running={phase === "pump"} />
            {/* Grease on its way: pump to main divider, then along every line in turn */}
            {phase === "pump" && u !== null
              ? [0, 0.33, 0.66].map((lag) => {
                  const p = along(FEED, (u / 0.2 + lag) % 1);
                  return <circle key={lag} cx={p.x} cy={p.y} r="3.5" fill={GREASE} stroke={GREASE_DARK} strokeWidth="1" />;
                })
              : null}
            {lines.map((r, i) => {
              const f = lineTravel(u, i);
              if (f === null) return null;
              const p = along(r, f);
              return <circle key={i} cx={p.x} cy={p.y} r="4" fill={GREASE} stroke={GREASE_DARK} strokeWidth="1.2" />;
            })}
            <text x={PUMP_AT.x - 6} y={PUMP_AT.y - 22} textAnchor="end" fill="#000000" fontSize="14" fontWeight="600" fontFamily="var(--font-inter)">
              EP-1
            </text>
          </g>

          {/* The points: fresh grease, a pulse as a dose lands, overflow and dryness by hand */}
          {points.map((p, k) => {
            const lvl = pointLevel(k);
            const dry = lvl < OPTIMAL.low;
            const excess = !auto && greased(k) ? Math.max(0, (lvl - OPTIMAL.high) / 55) : 0;
            const a = lineArrived(u, POINT_LINES[k]);
            return (
              <g key={k}>
                {excess > 0 ? (
                  <g>
                    <ellipse cx={p.x} cy={p.y + 5 + 3 * excess} rx={2.5 + 6 * excess} ry={2 + 4 * excess} fill={GREASE} stroke={GREASE_DARK} strokeWidth="1" />
                    <ellipse cx={p.x + 1.5} cy={p.y + 11 + 9 * excess} rx={1.2 + 1.5 * excess} ry={1.5 + 2.5 * excess} fill={GREASE} opacity={excess} />
                  </g>
                ) : null}
                {a !== null ? <circle cx={p.x} cy={p.y} r={5 + 11 * a} fill="none" stroke={GREASE} strokeWidth={3 * (1 - a)} opacity={1 - a} /> : null}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.2"
                  fill={dry ? "#ffffff" : GREASE}
                  stroke={dry ? "#c11e31" : "#ffffff"}
                  strokeWidth={dry ? 2.2 : 1.4}
                  className={dry && !reduced ? "animate-pulse" : undefined}
                />
              </g>
            );
          })}

          {gun !== null ? <GreaseGun at={points[gun]} /> : null}
        </svg>

        <div className="mt-2 grid gap-4 border-t border-neutral-200 px-2 pt-4 sm:grid-cols-[1fr_140px] sm:items-center">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <p className="font-ui text-[14px] font-semibold text-black">Fettmengde i lagrene</p>
              <ul className="flex gap-4 font-ui text-[13px] text-ink-muted">
                {(["automatisk", "manuell"] as LubeMode[]).map((m) => (
                  <li key={m} className={`flex items-center gap-1.5 ${m === mode ? "font-semibold text-black" : ""}`}>
                    <span aria-hidden="true" className={`h-[3px] w-4 rounded-full ${m === "automatisk" ? "bg-brand" : "bg-black"}`} />
                    {MODES[m].label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <GreaseChart mode={mode} t={t} full={reduced} />
            </div>
          </div>
          <figure className="mx-auto w-36 text-center sm:w-full">
            <PinSection mode={mode} level={pinLevel} turn={pose.bucket * 2} fresh={fresh} />
            <figcaption className="mt-1 font-ui text-[12px] leading-[1.35] text-ink-muted">
              <span className="block font-semibold text-black">Skuffebolten i snitt</span>
              {auto
                ? "Jevn fettfilm rundt hele bolten"
                : pinLevel > 110
                  ? "Rundt hele bolten, men ujevnt – tynt der den ligger an"
                  : "Tørker først der bolten ligger an"}
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4 pb-1">
          <div className="flex flex-wrap gap-3" role="group" aria-label="Velg smøring">
            {(Object.keys(MODES) as LubeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => choose(m)}
                className={`rounded-full border px-5 py-2 text-[16px] leading-[1.2] font-semibold transition ${
                  mode === m ? "border-brand bg-brand text-white" : "border-neutral-300 text-black hover:border-brand hover:text-brand"
                }`}
              >
                {MODES[m].label}
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
        <p className="text-lead text-ink-muted md:text-lead-lg">{system.summary}</p>
        <ol className="mt-8 space-y-3">
          {system.steps.map((s, i) => (
            <li
              key={s.heading}
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
                <h4 className="font-ui text-label font-semibold text-black md:text-label-lg">{s.heading}</h4>
                <p className="mt-1 font-ui text-body text-ink-muted md:text-body-lg">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {[
            { heading: "Hovedfordeler", points: MAIN_POINTS },
            { heading: "Sekundærfordeler", points: SECONDARY_POINTS },
          ].map((g) => (
            <div key={g.heading}>
              <p className="font-ui text-[15px] font-semibold text-black">{g.heading}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {g.points.map((p) => (
                  <li key={p} className="rounded-full bg-white px-3 py-1.5 font-ui text-[13px] leading-[1.4] font-medium text-ink-muted">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
