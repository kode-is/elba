// The clock and the grease model behind /anlegg's lubrication demo
// (components/sentralsmoring/LubricationDemo.tsx), kept pure so it can be
// tested (tests/smoremodell.test.ts).
//
// One loop is one working day, 07:00 to 15:00, as `t` from 0 to 1. The
// grease level is the amount in a bearing as a percentage of the optimum:
// 100 is just right, and the band from 80 to 120 is drawn as "riktig".

import type { LubeMode } from "@/lib/sentralsmoring";

/** One working day, in milliseconds of animation. */
export const DAY_MS = 22000;
export const DAY_START_HOUR = 7;
export const DAY_HOURS = 8;

export const OPTIMAL = { low: 80, high: 120 } as const;

/** Automatic: a lubrication cycle every PERIOD (six a day, so the loop is seamless), the first at FIRST_CYCLE, each CYCLE long. */
export const PERIOD = 1 / 6;
export const FIRST_CYCLE = 0.05;
export const CYCLE = 0.1;
/** Within a cycle (u from 0 to 1): the pump runs first, then the MX-F serves its outlets in turn. */
export const PUMP_END = 0.35;
export const OUTLET_GAP = 0.08;
export const OUTLET_TRAVEL = 0.15;

/** Manual: the operator greases the parked machine at the start of the day. */
export const GREASE_START = 0.01;
export const GREASE_END = 0.1;
/** One dig cycle, in day units (about four seconds). */
export const DIG = 0.19;

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

/** When outlet `i` (0-based, in MX-F order) starts to deliver within a cycle. */
export const outletStart = (i: number) => PUMP_END + i * OUTLET_GAP;

/** How far grease for outlet `i` has travelled along its line (0-1), or null if none is moving. */
export function outletTravel(u: number | null, i: number) {
  if (u === null) return null;
  const f = (u - outletStart(i)) / OUTLET_TRAVEL;
  return f >= 0 && f <= 1 ? f : null;
}

// Automatic: the level rises while a cycle delivers, and falls slowly in
// between, so it saws gently around the optimum.
const AUTO_LOW = 93;
const AUTO_HIGH = 107;
const RISE_FROM = PUMP_END * CYCLE;
const RISE_TO = (outletStart(5) + OUTLET_TRAVEL) * CYCLE;

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
const MANUAL_LEFT = 24;
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

/** Which manual point the gun is on (0-5), or null outside the greasing round. */
export function gunAt(t: number) {
  if (t < GREASE_START || t >= GREASE_END) return null;
  return Math.min(5, Math.floor(((t - GREASE_START) / (GREASE_END - GREASE_START)) * 6));
}

export type Pose = { boom: number; stick: number; bucket: number };

/** Parked, bucket on the ground: where manual greasing happens. */
export const STANDBY: Pose = { boom: 17, stick: 24, bucket: 18 };

// One dig cycle: reach out, cut in, curl, lift, dump, and back. Angles in
// degrees, clockwise on screen: a positive boom angle lowers the boom, a
// positive stick angle pulls the stick in, a positive bucket angle curls it.
const DIG_KEYS: { at: number; pose: Pose }[] = [
  { at: 0, pose: { boom: 2, stick: -26, bucket: -30 } },
  { at: 0.2, pose: { boom: 13, stick: -16, bucket: -12 } },
  { at: 0.45, pose: { boom: 12, stick: 20, bucket: 45 } },
  { at: 0.65, pose: { boom: -14, stick: 14, bucket: 70 } },
  { at: 0.85, pose: { boom: -12, stick: -22, bucket: -40 } },
  { at: 1, pose: { boom: 2, stick: -26, bucket: -30 } },
];

const mix = (a: Pose, b: Pose, f: number): Pose => ({
  boom: a.boom + (b.boom - a.boom) * f,
  stick: a.stick + (b.stick - a.stick) * f,
  bucket: a.bucket + (b.bucket - a.bucket) * f,
});

function digPose(phase: number): Pose {
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
