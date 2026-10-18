// The clock and the grease model behind /anlegg's lubrication demo
// (components/sentralsmoring/LubricationDemo.tsx), kept pure so it can be
// tested (tests/smoremodell.test.ts).
//
// One loop is one working day, 07:00 to 15:00, as `t` from 0 to 1. The
// grease level is the amount in a bearing as a percentage of the optimum:
// 100 is just right, and the band from 80 to 120 is drawn as "riktig".

import type { LubeMode } from "@/lib/sentralsmoring";

/** One working day, in milliseconds of animation. */
export const DAY_MS = 60000;
export const DAY_START_HOUR = 7;
export const DAY_HOURS = 8;

export const OPTIMAL = { low: 80, high: 120 } as const;

/** Automatic: a lubrication cycle every PERIOD (six a day, so the loop is seamless), the first at FIRST_CYCLE, each CYCLE long. */
export const PERIOD = 1 / 6;
export const FIRST_CYCLE = 0.03;
export const CYCLE = 0.12;

// Within a cycle (u from 0 to 1): the pump runs, then the main divider serves
// its six outlets in turn — five points and, last, the line to the secondary
// divider on the boom — and once that line has delivered, the secondary
// divider serves its five points in turn.
export const PUMP_END = 0.2;
export const MAIN_OUTLETS = 6;
export const MAIN_GAP = 0.08;
export const MAIN_TRAVEL = 0.1;
export const SECONDARY_OUTLETS = 5;
export const SECONDARY_GAP = 0.05;
export const SECONDARY_TRAVEL = 0.08;
/** The main divider's last outlet feeds the secondary divider. */
export const FEED_LINE = MAIN_OUTLETS - 1;

export const mainStart = (i: number) => PUMP_END + i * MAIN_GAP;
export const secondaryStart = (j: number) => mainStart(FEED_LINE) + MAIN_TRAVEL + j * SECONDARY_GAP;

/** All eleven lines: 0-5 from the main divider (5 is the feed), 6-10 from the secondary one. */
export const LINES = MAIN_OUTLETS + SECONDARY_OUTLETS;
export function lineStart(line: number) {
  return line < MAIN_OUTLETS ? mainStart(line) : secondaryStart(line - MAIN_OUTLETS);
}
export function lineTravelTime(line: number) {
  return line < MAIN_OUTLETS ? MAIN_TRAVEL : SECONDARY_TRAVEL;
}

/** Manual: the operator greases the parked machine at the start of the day. */
export const GREASE_START = 0.01;
export const GREASE_END = 0.13;
/** One dig cycle, in day units (about eight seconds). */
export const DIG = 0.135;

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function clockLabel(t: number) {
  const minutes = Math.floor(t * DAY_HOURS * 60);
  const h = DAY_START_HOUR + Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Where `t` falls in the automatic system's lubrication cycles: `u` is null between cycles. */
export function cycleAt(t: number): { index: number; u: number | null } {
  const index = Math.floor((t - FIRST_CYCLE) / PERIOD);
  const start = FIRST_CYCLE + index * PERIOD;
  const u = (t - start) / CYCLE;
  return { index, u: t >= FIRST_CYCLE && u < 1 ? u : null };
}

/** How far grease for `line` has travelled along it (0-1), or null if none is moving. */
export function lineTravel(u: number | null, line: number) {
  if (u === null) return null;
  const f = (u - lineStart(line)) / lineTravelTime(line);
  return f >= 0 && f <= 1 ? f : null;
}

/** How long ago (0-1 of a short pulse) the dose on `line` arrived, or null. */
export function lineArrived(u: number | null, line: number) {
  if (u === null) return null;
  const f = (u - lineStart(line) - lineTravelTime(line)) / 0.1;
  return f >= 0 && f <= 1 ? f : null;
}

export type CyclePhase = "idle" | "pump" | "main" | "secondary";

export function phaseOf(u: number | null): CyclePhase {
  if (u === null) return "idle";
  if (u < PUMP_END) return "pump";
  if (u < secondaryStart(0)) return "main";
  if (u < secondaryStart(SECONDARY_OUTLETS - 1) + SECONDARY_TRAVEL + 0.02) return "secondary";
  return "idle";
}

// Automatic: the level rises while a cycle delivers, and falls slowly in
// between, so it saws gently around the optimum.
const AUTO_LOW = 93;
const AUTO_HIGH = 107;
const RISE_FROM = PUMP_END * CYCLE;
const RISE_TO = (secondaryStart(SECONDARY_OUTLETS - 1) + SECONDARY_TRAVEL) * CYCLE;

function autoLevel(t: number) {
  const index = Math.floor((t - FIRST_CYCLE) / PERIOD);
  const tau = t - (FIRST_CYCLE + index * PERIOD);
  const fall = PERIOD - (RISE_TO - RISE_FROM);
  if (tau < RISE_FROM) return AUTO_HIGH - (AUTO_HIGH - AUTO_LOW) * ((tau + PERIOD - RISE_TO) / fall);
  if (tau < RISE_TO) return AUTO_LOW + (AUTO_HIGH - AUTO_LOW) * ((tau - RISE_FROM) / (RISE_TO - RISE_FROM));
  return AUTO_HIGH - (AUTO_HIGH - AUTO_LOW) * ((tau - RISE_TO) / fall);
}

// Manual: yesterday's leftovers, then everything at once at the gun, then a
// long slide through the optimum and below it.
export const MANUAL_LEFT = 24;
const MANUAL_PEAK = 175;

function manualLevel(t: number) {
  if (t < GREASE_START) return MANUAL_LEFT;
  if (t < GREASE_END) return MANUAL_LEFT + (MANUAL_PEAK - MANUAL_LEFT) * smooth((t - GREASE_START) / (GREASE_END - GREASE_START));
  const s = (t - GREASE_END) / (1 - GREASE_END);
  return MANUAL_LEFT + (MANUAL_PEAK - MANUAL_LEFT) * Math.pow(1 - s, 1.15);
}

export function greaseLevel(mode: LubeMode, t: number) {
  return mode === "automatisk" ? autoLevel(t) : manualLevel(t);
}

/** Which manual point the gun is on (0 to count-1), or null outside the greasing round. */
export function gunAt(t: number, count: number) {
  if (t < GREASE_START || t >= GREASE_END) return null;
  return Math.min(count - 1, Math.floor(((t - GREASE_START) / (GREASE_END - GREASE_START)) * count));
}

/**
 * The machine's attitude, in degrees counter-clockwise: the boom's pin-to-pin
 * line above horizontal, the stick against the boom (negative folds it down),
 * and the bucket against the stick (90 is level with the stick hanging
 * straight down; lower curls it in, higher opens it).
 */
export type Pose = { boom: number; stick: number; bucket: number };

/** The greasing position: stick plumb, bucket flat on the trench floor. */
export const STANDBY: Pose = { boom: 4.7, stick: -94.7, bucket: 90 };

// One dig cycle: reach out, cut in, crowd and curl, lift, dump, and back.
const DIG_KEYS: { at: number; pose: Pose }[] = [
  { at: 0, pose: { boom: 10, stick: -55, bucket: 125 } },
  { at: 0.15, pose: { boom: -2, stick: -60, bucket: 112 } },
  { at: 0.32, pose: { boom: -3, stick: -92, bucket: 72 } },
  { at: 0.48, pose: { boom: -6, stick: -125, bucket: 35 } },
  { at: 0.64, pose: { boom: 30, stick: -122, bucket: -14 } },
  { at: 0.82, pose: { boom: 36, stick: -72, bucket: 140 } },
  { at: 1, pose: { boom: 10, stick: -55, bucket: 125 } },
];

const mix = (a: Pose, b: Pose, f: number): Pose => ({
  boom: a.boom + (b.boom - a.boom) * f,
  stick: a.stick + (b.stick - a.stick) * f,
  bucket: a.bucket + (b.bucket - a.bucket) * f,
});

export function digPose(phase: number): Pose {
  for (let i = 1; i < DIG_KEYS.length; i++) {
    const a = DIG_KEYS[i - 1];
    const b = DIG_KEYS[i];
    if (phase <= b.at) return mix(a.pose, b.pose, smooth((phase - a.at) / (b.at - a.at)));
  }
  return DIG_KEYS[0].pose;
}

/** The machine's pose at `t`: digging all day, or parked first for the grease gun. */
export function poseAt(mode: LubeMode, t: number): Pose {
  if (mode === "automatisk") return digPose((t / DIG) % 1);
  if (t < GREASE_END) return STANDBY;
  const work = t - GREASE_END;
  const dig = digPose((work / DIG) % 1);
  // Ease out of the parked pose over the first part of the first dig cycle.
  return mix(STANDBY, dig, smooth(clamp(work / (DIG * 0.35))));
}
