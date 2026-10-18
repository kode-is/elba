// The clock and the grease model behind /anlegg's lubrication demo
// (components/sentralsmoring/LubricationDemo.tsx), kept pure so it can be
// tested (tests/smoremodell.test.ts).
//
// One loop is one working day, 07:00 to 15:00, as `t` from 0 to 1. The
// grease level is the amount in a bearing as a percentage of what it should
// hold: 100 is right, and 80 to 120 is drawn as the right band. The curves
// are an illustration, not measurements.

import type { LubeMode } from "@/lib/sentralsmoring";

/** One working day, in milliseconds of animation. */
export const DAY_MS = 60000;
export const DAY_START_HOUR = 7;
export const DAY_HOURS = 8;

export const OPTIMAL = { low: 80, high: 120 } as const;

// Automatic: the controller starts the pump after a set pause (counted while
// the ignition is on) and lets it run for a set time. While the pump
// delivers, the main divider strokes round and round, and every time one of
// its feed outlets delivers, the secondary divider on the boom moves on too.
// So both blocks work at the same time, for as long as the pump runs, and
// each point gets a number of small doses per run.
export const PERIOD = 1 / 8;
export const FIRST_CYCLE = 0.03;
/** Pump run time, in day units (about three seconds of animation). */
export const CYCLE = 0.05;

/** Within a run (u from 0 to 1): grease reaches the main divider, then the strokes start. */
export const STROKES_FROM = 0.12;
export const STROKES_TO = 0.86;
export const MAIN_GAP = 0.035;
export const SECONDARY_GAP = 0.05;
/** Time for a dose to travel a line, in run units. */
export const TRAVEL = 0.1;

/** Lines 0-4: main divider to its points; 5: main divider to the secondary; 6-12: secondary to its points. */
export const LINES = 13;
export const FEED_LINE = 5;
/** The main divider's eight outlets: five points, and three combined into the line to the secondary. */
const MAIN_OUTLET_LINE = [0, 1, 2, 3, 4, 5, 5, 5];
/** The secondary's eight outlets: seven points, two combined for the bucket pin. */
const SECONDARY_OUTLET_LINE = [6, 7, 8, 9, 10, 11, 12, 12];

/** Every moment (in run units) a dose leaves its divider for `line`. */
function emissions(line: number): number[] {
  const out: number[] = [];
  for (let s = 0; STROKES_FROM + s * MAIN_GAP <= STROKES_TO; s++) {
    if (MAIN_OUTLET_LINE[s % 8] === line) out.push(STROKES_FROM + s * MAIN_GAP);
  }
  const secondaryFrom = STROKES_FROM + FEED_LINE * MAIN_GAP + TRAVEL;
  for (let s = 0; secondaryFrom + s * SECONDARY_GAP <= STROKES_TO; s++) {
    if (SECONDARY_OUTLET_LINE[s % 8] === line) out.push(secondaryFrom + s * SECONDARY_GAP);
  }
  return out;
}
const EMISSIONS = Array.from({ length: LINES }, (_, l) => emissions(l));

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function clockLabel(t: number) {
  const minutes = Math.floor(t * DAY_HOURS * 60);
  const h = DAY_START_HOUR + Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Where `t` falls in the automatic system's runs: `u` is null while the pump pauses. */
export function cycleAt(t: number): { index: number; u: number | null } {
  const index = Math.floor((t - FIRST_CYCLE) / PERIOD);
  const start = FIRST_CYCLE + index * PERIOD;
  const u = (t - start) / CYCLE;
  return { index, u: t >= FIRST_CYCLE && u < 1 ? u : null };
}

/** How far each dose now on `line` has travelled along it (0-1). */
export function lineDoses(u: number | null, line: number): number[] {
  if (u === null) return [];
  return EMISSIONS[line].map((e) => (u - e) / TRAVEL).filter((f) => f >= 0 && f <= 1);
}

/** How long ago (0-1 of a short pulse) a dose on `line` arrived, or null. */
export function lineArrived(u: number | null, line: number) {
  if (u === null) return null;
  for (const e of EMISSIONS[line]) {
    const f = (u - e - TRAVEL) / 0.07;
    if (f >= 0 && f <= 1) return f;
  }
  return null;
}

/** When doses leave for `line` within a run — for the tests. */
export const lineEmissions = (line: number) => EMISSIONS[line];

export type CyclePhase = "idle" | "pump" | "dosing";

export function phaseOf(u: number | null): CyclePhase {
  if (u === null) return "idle";
  return u < 0.4 ? "pump" : "dosing";
}

// Automatic: the level rises while a run delivers and falls slowly in
// between, so it saws gently around the right amount.
const AUTO_LOW = 93;
const AUTO_HIGH = 107;
const RISE_FROM = STROKES_FROM * CYCLE;
const RISE_TO = (STROKES_TO + TRAVEL) * CYCLE;

function autoLevel(t: number) {
  const index = Math.floor((t - FIRST_CYCLE) / PERIOD);
  const tau = t - (FIRST_CYCLE + index * PERIOD);
  const fall = PERIOD - (RISE_TO - RISE_FROM);
  if (tau < RISE_FROM) return AUTO_HIGH - (AUTO_HIGH - AUTO_LOW) * ((tau + PERIOD - RISE_TO) / fall);
  if (tau < RISE_TO) return AUTO_LOW + (AUTO_HIGH - AUTO_LOW) * ((tau - RISE_FROM) / (RISE_TO - RISE_FROM));
  return AUTO_HIGH - (AUTO_HIGH - AUTO_LOW) * ((tau - RISE_TO) / fall);
}

// Manual: greased once at the start of the shift, as the machine makers
// prescribe for the bucket linkage (daily or every 10 hours). The bearing
// fills up — what it cannot take is pushed out at the seals — and the film
// thins through the day.
export const GREASE_START = 0.01;
export const GREASE_END = 0.08;
export const MANUAL_LEFT = 45;
const MANUAL_FULL = 110;

function manualLevel(t: number) {
  if (t < GREASE_START) return MANUAL_LEFT;
  if (t < GREASE_END) return MANUAL_LEFT + (MANUAL_FULL - MANUAL_LEFT) * smooth((t - GREASE_START) / (GREASE_END - GREASE_START));
  const s = (t - GREASE_END) / (1 - GREASE_END);
  return MANUAL_LEFT + (MANUAL_FULL - MANUAL_LEFT) * (1 - s * s);
}

export function greaseLevel(mode: LubeMode, t: number) {
  return mode === "automatisk" ? autoLevel(t) : manualLevel(t);
}

/** Grease pushed out past the seals and left on the machine (0-1), for a point greased at `at`. */
export function overflowAt(t: number, at: number) {
  if (t < at) return 0;
  return 0.8 - 0.45 * clamp((t - at) / (1 - at));
}

/** Which stop of the manual round (0 to stops-1) the gun is at, or null outside the round. */
export function gunAt(t: number, stops: number) {
  if (t < GREASE_START || t >= GREASE_END) return null;
  return Math.min(stops - 1, Math.floor(((t - GREASE_START) / (GREASE_END - GREASE_START)) * stops));
}

/** When the gun has finished stop `k` of `stops`. */
export const gunReaches = (k: number, stops: number) => GREASE_START + ((GREASE_END - GREASE_START) * (k + 1)) / stops;

/**
 * The machine's attitude, in degrees counter-clockwise: the boom's pin-to-pin
 * line above horizontal, the stick against the boom (negative folds it down),
 * and the bucket against the stick (90 is level with the stick hanging
 * straight down; lower curls it in, higher opens it).
 */
export type Pose = { boom: number; stick: number; bucket: number };

/** The greasing position: bucket flat on the ground in front of the tracks, stick in. */
export const STANDBY: Pose = { boom: 25.1, stick: -140.1, bucket: 114.9 };

// One dig cycle, fitted (by inverse kinematics) to the trench in Machine.tsx
// so the bucket cuts along the floor without passing through it: reach out,
// cut in, drag along the floor, crowd and curl at the near wall, lift, carry
// out curled, dump on the spoil heap beyond the trench, and back.
const DIG_KEYS: { at: number; pose: Pose }[] = [
  { at: 0, pose: { boom: 18.9, stick: -74.9, bucket: 106.1 } },
  { at: 0.14, pose: { boom: 6.2, stick: -73.5, bucket: 95.4 } },
  { at: 0.3, pose: { boom: 3.6, stick: -70.5, bucket: 66.9 } },
  { at: 0.42, pose: { boom: 2, stick: -67.2, bucket: 35.2 } },
  { at: 0.46, pose: { boom: 2.6, stick: -64.9, bucket: 20.3 } },
  { at: 0.5, pose: { boom: 4.4, stick: -65.5, bucket: 6.1 } },
  { at: 0.56, pose: { boom: 8, stick: -73.9, bucket: -24.1 } },
  { at: 0.67, pose: { boom: 23, stick: -93, bucket: -30.1 } },
  { at: 0.78, pose: { boom: 14.9, stick: -40.1, bucket: -74.8 } },
  { at: 0.88, pose: { boom: 15.1, stick: -26.2, bucket: 66.1 } },
  { at: 1, pose: { boom: 18.9, stick: -74.9, bucket: 106.1 } },
];

/** Bucket lifted clear of the ground on the way out of the greasing position. */
const LIFT_OFF: Pose = { boom: 34, stick: -125, bucket: 100 };

/** One dig cycle, in day units (about eight seconds). */
export const DIG = 0.135;

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
  // Out of the greasing position: lift clear of the ground first, then reach
  // out to the first dig pose, then dig.
  const work = t - GREASE_END;
  const lift = DIG * 0.15;
  const lead = DIG * 0.4;
  if (work < lift) return mix(STANDBY, LIFT_OFF, smooth(work / lift));
  if (work < lead) return mix(LIFT_OFF, DIG_KEYS[0].pose, smooth((work - lift) / (lead - lift)));
  return digPose(((work - lead) / DIG) % 1);
}
