"use client";

import { useState } from "react";
import { LUBE_POINTS, MAIN_POINTS, MODES, SECONDARY_POINTS, SKIPPED_POINT, type LubeMode } from "@/lib/sentralsmoring";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ILL } from "@/lib/illustrasjon";
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
  gunReaches,
  LINES,
  lineArrived,
  lineDoses,
  MANUAL_LEFT,
  OPTIMAL,
  overflowAt,
  PERIOD,
  phaseOf,
  poseAt,
  type CyclePhase,
} from "@/lib/smoremodell";
import { along, Arm, Body, Dividers, FEED, GreaseGun, GROUND, polyline, Pump, PUMP_AT, PUMP_SCALE, routes } from "@/components/sentralsmoring/Machine";
import { GreaseChart } from "@/components/sentralsmoring/GreaseChart";
import { PinSection } from "@/components/sentralsmoring/PinSection";
import { DemoControl, DemoStatus, DemoSteps, DemoToggle, useLoopClock, useOnScreen, useSmallScreen } from "@/components/demo/Demo";

// One loop is one working day, about a minute long. With central lubrication
// the excavator digs all day; after each pause the pump runs for a while, and
// while it runs the main divider on the upper frame and the secondary divider
// on the boom both cycle, sending small doses to every point in turn. With
// the grease gun the machine is parked for one round at the start of the
// shift (one hard-to-reach point is missed), then digs on what it got. The
// chart keeps score; the pin section shows where the grease ends up. Under
// reduced motion each mode holds one explained frame.

/** Every line that ends at a lubrication point (the feed to the secondary divider does not). */
const POINT_LINES = Array.from({ length: LINES }, (_, i) => i).filter((i) => i !== FEED_LINE);
const BUCKET_PIN = LUBE_POINTS.indexOf("Skuffebolt");
const SKIPPED = LUBE_POINTS.indexOf(SKIPPED_POINT);
/** The manual round: every point but the skipped one, in order. */
const STOPS = LUBE_POINTS.map((_, k) => k).filter((k) => k !== SKIPPED);

/** Still frames for reduced motion: the dividers at work, and a thin afternoon. */
const STILL: Record<LubeMode, number> = {
  automatisk: FIRST_CYCLE + 2 * PERIOD + 0.6 * CYCLE,
  manuell: 0.8,
};

const AUTO_STATUS: Record<CyclePhase, string> = {
  idle: "Graver. Pumpen venter til neste syklus",
  pump: "Pumpen starter",
  dosing: "Fordelerne doserer til alle punkter",
};

export function LubricationDemo() {
  const [mode, setMode] = useState<LubeMode>("automatisk");
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const small = useSmallScreen();
  const { ref, visible } = useOnScreen<HTMLDivElement>();
  const [ms, setMs] = useLoopClock(visible && !reduced && !paused, DAY_MS);

  const t = reduced ? STILL[mode] : ms / DAY_MS;
  const auto = mode === "automatisk";
  const pose = poseAt(mode, t);
  const level = greaseLevel(mode, t);
  const u = auto ? cycleAt(t).u : null;
  const phase = phaseOf(u);
  const lines = routes(pose);
  // Marks and labels grow on a phone, where the drawing renders at under half size.
  const k = small ? 1.8 : 1;

  // The manual round: when each point got the gun, if it did.
  const gunStop = auto ? null : gunAt(t, STOPS.length);
  const greasedAt = (p: number) => (p === SKIPPED ? null : gunReaches(STOPS.indexOf(p), STOPS.length));
  const greased = (p: number) => {
    const at = greasedAt(p);
    return at !== null && t >= at;
  };
  const pointLevel = (p: number) => (auto ? level : greased(p) ? level : MANUAL_LEFT);

  let step: number;
  let status: string;
  if (auto) {
    step = phase === "pump" ? 0 : phase === "dosing" ? 1 : 2;
    status = AUTO_STATUS[phase];
  } else if (t < GREASE_END) {
    step = 0;
    status = t < GREASE_START ? "Parkert, klar til smøring" : "Smører med fettpresse ved skiftstart";
  } else if (t < 0.35) [step, status] = [1, "Graver. Overskuddet ligger utenpå boltene"];
  else if (level >= OPTIMAL.low) [step, status] = [2, "Graver. Fettfilmen tynnes ut"];
  else [step, status] = [2, "For lite fett i lagrene"];

  const alarm = !auto && t >= GREASE_END && level < OPTIMAL.low;
  const system = MODES[mode];
  const points = POINT_LINES.map((i) => lines[i][lines[i].length - 1]);
  const pinPulse = lineArrived(u, POINT_LINES[BUCKET_PIN]);
  const fresh = pinPulse === null ? 0 : Math.sin(Math.PI * pinPulse);

  const choose = (next: LubeMode) => {
    setMode(next);
    setMs(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-12">
      <div ref={ref} className="relative overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <DemoStatus tone={alarm ? "alarm" : phase !== "idle" || (!auto && t < GREASE_END) ? "active" : "idle"} text={status} aside={`kl. ${clockLabel(t)}`} />

        <svg viewBox="16 44 760 372" role="img" aria-label={`${system.label}: ${system.summary}`} className="block h-auto w-full">
          <path d={GROUND.fill} fill={ILL.surface} />
          <path d={GROUND.surface} fill="none" stroke="#d6d1ca" strokeWidth="2" />

          <Body />
          <Arm pose={pose} />

          {/* The lubrication system: only on the machine that has one */}
          <g className="transition-opacity duration-500" opacity={auto ? 1 : 0}>
            <path d={polyline(FEED)} fill="none" stroke={ILL.hose} strokeWidth={2 * k} strokeLinejoin="round" />
            {lines.map((r, i) => (
              <g key={i}>
                <path d={polyline(r)} fill="none" stroke="#ffffff" strokeWidth={3.4 * k} strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
                <path d={polyline(r)} fill="none" stroke={ILL.hose} strokeWidth={(i === FEED_LINE ? 2.6 : 1.7) * k} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            ))}
            <Dividers pose={pose} main={phase === "dosing"} secondary={phase === "dosing"} />
            <Pump x={PUMP_AT.x} y={PUMP_AT.y} level={0.82 - 0.16 * t} stir={u !== null ? u * 1600 : 0} running={u !== null} scale={PUMP_SCALE} />
            {/* Doses on their way: pump to main divider while it runs, then along every line in turn */}
            {u !== null
              ? [0, 0.33, 0.66].map((lag) => {
                  const p = along(FEED, (u * 4 + lag) % 1);
                  return <circle key={lag} cx={p.x} cy={p.y} r={2.6 * k} fill={ILL.grease} stroke={ILL.greaseDark} strokeWidth="1" />;
                })
              : null}
            {lines.flatMap((r, i) =>
              lineDoses(u, i).map((f, j) => {
                const p = along(r, f);
                return <circle key={`${i}-${j}`} cx={p.x} cy={p.y} r={3.2 * k} fill={ILL.grease} stroke={ILL.greaseDark} strokeWidth="1" />;
              }),
            )}
            <text x={PUMP_AT.x - 4} y={PUMP_AT.y - 4} textAnchor="end" fill="#000000" fontSize={13 * k} fontWeight="600" fontFamily="var(--font-inter)">
              EP-1
            </text>
          </g>

          {/* The points: fresh grease, a ring as a dose lands; overflow and dryness by hand */}
          {points.map((p, i) => {
            const lvl = pointLevel(i);
            const dry = lvl < OPTIMAL.low;
            const at = greasedAt(i);
            const overflow = !auto && at !== null ? overflowAt(t, at) : 0;
            const a = lineArrived(u, POINT_LINES[i]);
            return (
              <g key={i}>
                {overflow > 0 ? (
                  <g>
                    <ellipse cx={p.x} cy={p.y + 4 + 3 * overflow} rx={(2.5 + 5 * overflow) * k} ry={(2 + 3.5 * overflow) * k} fill={ILL.grease} stroke={ILL.greaseDark} strokeWidth="1" />
                    <ellipse cx={p.x + 1.5} cy={p.y + 10 + 7 * overflow} rx={(1.2 + 1.2 * overflow) * k} ry={(1.5 + 2 * overflow) * k} fill={ILL.grease} opacity={overflow} />
                  </g>
                ) : null}
                {a !== null ? <circle cx={p.x} cy={p.y} r={(4.5 + 9 * a) * k} fill="none" stroke={ILL.grease} strokeWidth={2.5 * (1 - a)} opacity={1 - a} /> : null}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3.8 * k}
                  fill={dry ? "#ffffff" : ILL.grease}
                  stroke={dry ? ILL.brand : "#ffffff"}
                  strokeWidth={dry ? 2 : 1.3}
                  className={dry ? "motion-safe:animate-pulse" : undefined}
                />
              </g>
            );
          })}

          {gunStop !== null ? <GreaseGun at={points[STOPS[gunStop]]} /> : null}
        </svg>

        <div className="mt-2 grid gap-4 border-t border-line px-2 pt-4 sm:grid-cols-[1fr_140px] sm:items-center">
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
              <GreaseChart mode={mode} t={t} full={reduced} small={small} />
            </div>
          </div>
          <figure className="mx-auto w-36 text-center sm:w-full">
            <PinSection mode={mode} level={pointLevel(BUCKET_PIN)} turn={pose.bucket - 90} fresh={fresh} />
            <figcaption className="mt-1 font-ui text-[12px] leading-[1.35] text-ink-muted">
              <span className="block font-semibold text-black">Skuffebolten i snitt</span>
              {auto
                ? "Jevn fettfilm, også på den belastede siden"
                : pointLevel(BUCKET_PIN) > 100
                  ? "Fett rundt bolten, tynnest der den ligger an"
                  : "Den belastede siden tørker først"}
              <span className="block">Ikke i målestokk</span>
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4 pb-1">
          <DemoToggle
            label="Velg smøring"
            options={(Object.keys(MODES) as LubeMode[]).map((m) => ({ key: m, label: MODES[m].label }))}
            value={mode}
            onChange={choose}
          />
          {!reduced ? <DemoControl kind={paused ? "play" : "pause"} onClick={() => setPaused((p) => !p)} /> : null}
        </div>
      </div>

      <div>
        <p className="text-lead text-ink-muted md:text-lead-lg">{system.summary}</p>
        <div className="mt-8">
          <DemoSteps steps={system.steps} current={reduced ? null : step} />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {[
            { heading: "Hovedfordeler", points: MAIN_POINTS },
            { heading: "Sekundærfordeler", points: SECONDARY_POINTS },
          ].map((g) => (
            <div key={g.heading}>
              <p className="font-ui text-[15px] font-semibold text-black">{g.heading}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {g.points.map((p) => (
                  <li key={p} className="rounded-full bg-white px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium text-ink-muted">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 font-ui text-[14px] leading-[1.6] text-ink-muted">
          Tegningen er forenklet. En maskin i denne klassen har flere smørepunkter enn de som er vist her.
        </p>
      </div>
    </div>
  );
}
