"use client";

import { useEffect, useRef, useState } from "react";
import { LUBE_POINTS, MODES, type LubeMode } from "@/lib/sentralsmoring";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import {
  clockLabel,
  CYCLE,
  cycleAt,
  DAY_MS,
  FIRST_CYCLE,
  GREASE_END,
  GREASE_START,
  greaseLevel,
  gunAt,
  OPTIMAL,
  OUTLET_GAP,
  OUTLET_TRAVEL,
  outletStart,
  outletTravel,
  PERIOD,
  poseAt,
  PUMP_END,
} from "@/lib/smoremodell";
import {
  along,
  Arm,
  Distributor,
  FEED,
  GREASE,
  GREASE_DARK,
  GreaseGun,
  LINE,
  polyline,
  Pump,
  routeAt,
  Undercarriage,
} from "@/components/sentralsmoring/Machine";
import { GreaseChart } from "@/components/sentralsmoring/GreaseChart";
import { PinSection } from "@/components/sentralsmoring/PinSection";

// One loop is one working day. With central lubrication the excavator digs
// all day while the pump runs a cycle every so often and the MX-F serves the
// six points one after another. With the grease gun the machine is parked
// for a big dose at the start of the day, then digs on what it got. The
// chart under the drawing keeps score; the pin section shows where the
// grease ends up. Under reduced motion each mode holds one explained frame.

/** Still frames for reduced motion: grease on its way to the points, and a dry afternoon. */
const STILL: Record<LubeMode, number> = {
  automatisk: FIRST_CYCLE + 3 * PERIOD + 0.6 * CYCLE,
  manuell: 0.85,
};

const PUMP = { x: 170, y: 160 };

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
  const { u } = auto ? cycleAt(t) : { u: null };

  // The automatic system's moment in its cycle.
  const pumping = u !== null && u < PUMP_END;
  const outlet = u === null ? null : [0, 1, 2, 3, 4, 5].find((i) => u >= outletStart(i) && u < outletStart(i) + OUTLET_GAP) ?? null;
  const pinOut = u === null ? 0 : Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (u - PUMP_END) / (outletStart(5) + OUTLET_GAP - PUMP_END)))));
  const arrived = (i: number) => (u === null ? 0 : (u - outletStart(i) - OUTLET_TRAVEL) / 0.12);

  // The manual round: which points the gun has done, and which it is on.
  const gun = auto ? null : gunAt(t);
  const greased = (i: number) => t >= GREASE_END || (t >= GREASE_START && gun !== null && i < gun);
  const pointLevel = (i: number) => (auto ? level : greased(i) ? level : greaseLevel("manuell", 0));

  let step: number;
  let status: string;
  if (auto) {
    if (u !== null && u < PUMP_END) [step, status] = [0, "EP-1 pumper fett"];
    else if (u !== null && outlet !== null) [step, status] = [1, `MX-F fordeler: ${LUBE_POINTS[outlet].toLowerCase()}`];
    else [step, status] = [2, "Graver – alle punkter smurt"];
  } else if (t < GREASE_END) {
    [step, status] = [0, gun === null ? "Parkert – klar for fettpressen" : `Fettpresse: ${LUBE_POINTS[gun].toLowerCase()}`];
  } else if (level > OPTIMAL.high) [step, status] = [1, "For mye fett – presses ut"];
  else if (level >= OPTIMAL.low) [step, status] = [2, "Graver – fettet tynnes ut"];
  else [step, status] = [2, "For lite fett – slitasje"];

  const alarm = !auto && level < OPTIMAL.low;
  const routes = [0, 1, 2, 3, 4, 5].map((i) => routeAt(pose, i));
  const points = routes.map((r) => r[r.length - 1]);
  const system = MODES[mode];
  const fresh = auto ? Math.max(0, 1 - Math.abs(arrived(0) - 0.3) / 0.7) * (arrived(0) >= 0 && arrived(0) <= 1 ? 1 : 0) : 0;

  const choose = (next: LubeMode) => {
    setMode(next);
    setClock(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-14">
      <div ref={ref} className="relative overflow-hidden rounded-[20px] bg-white p-3 shadow-sm md:p-5">
        <div className="mb-2 flex items-center justify-between gap-3 px-2 pt-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300 ${
                alarm || pumping ? "animate-pulse bg-brand" : "bg-black"
              }`}
            />
            <span className="truncate font-ui text-[13px] font-semibold text-black md:text-[14px]">{status}</span>
          </div>
          <span className="shrink-0 font-ui text-[13px] text-ink-muted tabular-nums">kl. {clockLabel(t)}</span>
        </div>

        <svg viewBox="60 60 640 352" role="img" aria-label={`${system.label}: ${system.summary}`} className="block h-auto w-full">
          {/* Ground, with the pit the machine digs in */}
          <path d="M60 364 H436 C466 398 516 410 576 410 C628 410 650 392 668 364 H700 V412 H60 Z" fill="#f5f2ef" />
          <path d="M60 364 H436 C466 398 516 410 576 410 C628 410 650 392 668 364 H700" fill="none" stroke="#e0e0e0" strokeWidth="2" />

          <Undercarriage />
          <Arm pose={pose} />

          {/* The lubrication system: only on the machine that has one */}
          <g className="transition-opacity duration-500" opacity={auto ? 1 : 0}>
            <path d={polyline(FEED)} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" />
            <path d={polyline(FEED)} fill="none" stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
            {routes.map((r, i) => (
              <g key={i}>
                <path d={polyline(r)} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
                <path d={polyline(r)} fill="none" stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              </g>
            ))}
            <Pump x={PUMP.x} y={PUMP.y} level={0.82 - 0.16 * t} stir={u === null ? 0 : u * 900} running={pumping} />
            <Distributor active={outlet} pin={pinOut} />
            {/* Grease on its way: pump to MX-F, then MX-F to each point */}
            {u !== null && pumping && u > 0.04
              ? [0, 0.5].map((lag) => {
                  const f = ((u - 0.04) / (PUMP_END - 0.04) + lag) % 1;
                  const p = along(FEED, f);
                  return <circle key={lag} cx={p.x} cy={p.y} r="3.5" fill={GREASE} stroke={GREASE_DARK} strokeWidth="1" />;
                })
              : null}
            {routes.map((r, i) => {
              const f = outletTravel(u, i);
              if (f === null) return null;
              const p = along(r, f);
              return <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={GREASE} stroke={GREASE_DARK} strokeWidth="1.2" />;
            })}
            <text x="190" y="150" textAnchor="middle" fill="#000000" fontSize="14" fontWeight="600" fontFamily="var(--font-inter)">
              EP-1
            </text>
            <text x="146" y="256" textAnchor="end" fill="#000000" fontSize="14" fontWeight="600" fontFamily="var(--font-inter)">
              MX-F
            </text>
          </g>

          {/* The points: fresh grease, a pulse as a dose lands, overflow and dryness by hand */}
          {points.map((p, i) => {
            const lvl = pointLevel(i);
            const dry = lvl < OPTIMAL.low;
            const excess = !auto && greased(i) ? Math.max(0, (lvl - OPTIMAL.high) / 55) : 0;
            const a = arrived(i);
            return (
              <g key={i}>
                {excess > 0 ? (
                  <g>
                    <ellipse cx={p.x} cy={p.y + 6 + 4 * excess} rx={3 + 8 * excess} ry={2 + 5 * excess} fill={GREASE} stroke={GREASE_DARK} strokeWidth="1" />
                    <ellipse cx={p.x + 2} cy={p.y + 14 + 12 * excess} rx={1.5 + 2 * excess} ry={2 + 3 * excess} fill={GREASE} opacity={excess} />
                  </g>
                ) : null}
                {auto && a >= 0 && a <= 1 ? (
                  <circle cx={p.x} cy={p.y} r={6 + 12 * a} fill="none" stroke={GREASE} strokeWidth={3 * (1 - a)} opacity={1 - a} />
                ) : null}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill={dry ? "#ffffff" : GREASE}
                  stroke={dry ? "#c11e31" : "#ffffff"}
                  strokeWidth={dry ? 2.5 : 1.5}
                  className={dry && !reduced ? "animate-pulse" : undefined}
                />
              </g>
            );
          })}

          {gun !== null ? <GreaseGun at={points[gun]} /> : null}
        </svg>

        <div className="mt-2 grid gap-4 border-t border-neutral-200 px-2 pt-4 sm:grid-cols-[1fr_128px] sm:items-center">
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
          <figure className="mx-auto w-32 text-center sm:w-full">
            <PinSection mode={mode} level={level} turn={pose.bucket * 2.5} fresh={fresh} />
            <figcaption className="mt-1 font-ui text-[12px] leading-[1.35] text-ink-muted">
              <span className="block font-semibold text-black">Skuffebolten i snitt</span>
              {auto ? "Fett rundt hele bolten" : "Fett bare på den ubelastede siden"}
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
              className={`flex gap-4 rounded-[20px] border-2 bg-white p-5 transition-colors duration-300 ${
                !reduced && step === i ? "border-brand" : "border-transparent"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold transition-colors duration-300 ${
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
        <p className="mt-8 font-ui text-[15px] font-semibold text-black">Smørepunktene i tegningen</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {LUBE_POINTS.map((p) => (
            <li key={p} className="rounded-full bg-white px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium text-ink-muted">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
