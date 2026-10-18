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

// After the first stretch of the day, the clock runs faster: in manual mode
// once the greasing round is done and the machine has driven off, in
// automatic mode except while the pump runs, so the dosing stays readable.
// Only the clock speeds up; the machine keeps digging at its own pace.
export const SLOW_TO = 0.14;
export const FAST = 4;

/** The day as stretches of [from, to, speed], in day units. */
function stretches(mode: LubeMode): [number, number, number][] {
  const out: [number, number, number][] = [[0, SLOW_TO, 1]];
  if (mode === "manuell") return [...out, [SLOW_TO, 1, FAST]];
  let at = SLOW_TO;
  for (let k = 0; FIRST_CYCLE + k * PERIOD < 1; k++) {
    const run = FIRST_CYCLE + k * PERIOD;
    const runEnd = Math.min(1, run + CYCLE);
    if (runEnd <= at) continue;
    if (run > at) out.push([at, run, FAST]);
    out.push([Math.max(at, run), runEnd, 1]);
    at = runEnd;
  }
  if (at < 1) out.push([at, 1, FAST]);
  return out;
}
const STRETCHES = { automatisk: stretches("automatisk"), manuell: stretches("manuell") };

/** One day of the loop, in milliseconds of animation. */
export function dayLoopMs(mode: LubeMode) {
  return STRETCHES[mode].reduce((sum, [a, b, v]) => sum + ((b - a) * DAY_MS) / v, 0);
}

/**
 * The day's clock `t` (0-1) and the machine's own time `motion` (day units at
 * the normal pace, for its movements) at `ms` into the loop.
 */
export function dayClock(mode: LubeMode, ms: number) {
  const motion = ms / DAY_MS;
  let left = ms;
  for (const [a, b, v] of STRETCHES[mode]) {
    const span = ((b - a) * DAY_MS) / v;
    if (left <= span) return { t: Math.min(0.9999, a + (left * v) / DAY_MS), motion };
    left -= span;
  }
  return { t: 0.9999, motion };
}
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
// prescribe for the bucket linkage (daily or every 10 hours). Right after the
// gun the joint holds more than it should — the surplus is still being pushed
// out at the seals — so the level overshoots into "too much" and falls back
// into the band within the first hour or so; then the film thins through the
// day.
export const GREASE_START = 0.01;
export const GREASE_END = 0.08;
export const MANUAL_LEFT = 45;
const MANUAL_FULL = 110;
const MANUAL_SURPLUS = 30;
/** How fast the surplus squeezes out, in day units. */
const SQUEEZE = 0.07;

function manualLevel(t: number) {
  if (t < GREASE_START) return MANUAL_LEFT;
  if (t < GREASE_END)
    return MANUAL_LEFT + (MANUAL_FULL + MANUAL_SURPLUS - MANUAL_LEFT) * smooth((t - GREASE_START) / (GREASE_END - GREASE_START));
  const s = (t - GREASE_END) / (1 - GREASE_END);
  return MANUAL_LEFT + (MANUAL_FULL - MANUAL_LEFT) * (1 - s * s) + MANUAL_SURPLUS * Math.exp(-(t - GREASE_END) / SQUEEZE);
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

/** The greasing position: bucket resting on its heel on flat ground in front of the tracks, stick in. */
export const STANDBY: Pose = { boom: 19, stick: -146.2, bucket: 119.2 };

// One dig cycle, planned by where the bucket's tooth goes (solved back to
// boom, stick and bucket by inverse kinematics) and checked in
// tests/gravemaskin.test.ts: the tooth cuts in at the far end and goes down a
// ramp, along the floor and up the near wall, with the bucket held steep
// enough that its body rides inside the cut; then the bucket lifts out
// curled with the stick pulled in (it never curls past the stick), carries
// out to the spoil heap and only opens there. The trench in
// lib/gravemaskin.ts is the tooth's path.
const DIG_KEYS: { at: number; pose: Pose }[] = [
  { at: 0, pose: { boom: 19.6, stick: -41.7, bucket: 88.2 } },
  { at: 0.06, pose: { boom: 16.3, stick: -49.3, bucket: 95.1 } },
  { at: 0.12, pose: { boom: 14.6, stick: -58.4, bucket: 103.7 } },
  { at: 0.2, pose: { boom: 12.2, stick: -71.3, bucket: 114.1 } },
  { at: 0.28, pose: { boom: 8.3, stick: -79, bucket: 117.6 } },
  { at: 0.36, pose: { boom: 6.8, stick: -87.7, bucket: 120.9 } },
  { at: 0.43, pose: { boom: 7.1, stick: -92.8, bucket: 113.7 } },
  { at: 0.49, pose: { boom: 8.3, stick: -87.8, bucket: 84.5 } },
  { at: 0.55, pose: { boom: 9, stick: -79.9, bucket: 45.9 } },
  { at: 0.6, pose: { boom: 9.1, stick: -72.8, bucket: 8.6 } },
  { at: 0.64, pose: { boom: 16, stick: -85, bucket: 8 } },
  { at: 0.68, pose: { boom: 30, stick: -125, bucket: 8 } },
  { at: 0.8, pose: { boom: 24, stick: -56, bucket: 8 } },
  { at: 0.92, pose: { boom: 16, stick: -30, bucket: 106 } },
  { at: 1, pose: { boom: 19.6, stick: -41.7, bucket: 88.2 } },
];

/** The part of the dig cycle where the bucket is in the ground. */
export const CUT = { from: 0.06, to: 0.6 } as const;

/** The bucket's attitude in degrees (0: level, mouth towards the machine; higher tips the mouth down). */
export const bucketAttitude = (pose: Pose) => pose.boom + pose.stick + pose.bucket;
/** Soil starts to slide out once the mouth has tipped this far, and is all out here. */
export const SPILL = { from: 60, to: 92 } as const;
/** The bucket opens over the heap at the end of this part of the cycle. */
const DUMP = { from: 0.8, to: 0.92 } as const;

/** How full the bucket is (0-1): filled through the cut, emptied over the heap as the mouth tips past SPILL. */
export function loadAt(phase: number, pose: Pose) {
  if (phase < 0.2 || phase >= DUMP.to) return 0;
  if (phase < 0.5) return smooth((phase - 0.2) / 0.3);
  if (phase < DUMP.from) return 1;
  return 1 - clamp((bucketAttitude(pose) - SPILL.from) / (SPILL.to - SPILL.from));
}

/** Whether soil is falling from the bucket now, and how far through (0-1). */
export function spillAt(phase: number, pose: Pose) {
  if (phase < DUMP.from || phase >= DUMP.to) return 0;
  const f = (bucketAttitude(pose) - SPILL.from) / (SPILL.to - SPILL.from);
  return f > 0 && f < 1 ? f : 0;
}

/** Bucket lifted clear of the ground on the way out of the greasing position. */
const LIFT_OFF: Pose = { boom: 32, stick: -130, bucket: 100 };

/** One dig cycle, in day units (about eight seconds). */
export const DIG = 0.135;

const mix = (a: Pose, b: Pose, f: number): Pose => ({
  boom: a.boom + (b.boom - a.boom) * f,
  stick: a.stick + (b.stick - a.stick) * f,
  bucket: a.bucket + (b.bucket - a.bucket) * f,
});

export const DIG_KEY_POSES = DIG_KEYS;

export function digPose(phase: number): Pose {
  for (let i = 1; i < DIG_KEYS.length; i++) {
    const a = DIG_KEYS[i - 1];
    const b = DIG_KEYS[i];
    if (phase <= b.at) return mix(a.pose, b.pose, smooth((phase - a.at) / (b.at - a.at)));
  }
  return DIG_KEYS[0].pose;
}

/** Where the machine is in its dig cycle at `t` (0-1), or null while parked or leaving the greasing position. */
export function digPhaseAt(mode: LubeMode, t: number): number | null {
  if (mode === "automatisk") return (t / DIG) % 1;
  const work = t - GREASE_END - DIG * 0.4;
  return work < 0 ? null : (work / DIG) % 1;
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
