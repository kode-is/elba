// The excavator in /anlegg's lubrication demo, as geometry: a 50-tonne class
// machine at CAT 350 proportions (6.9 m reach boom, 3.35 m stick, 5.4 m
// track) with a large GP bucket, laid out in metres. Pure, so the tests can
// check what the drawing (components/sentralsmoring/Machine.tsx) shows: the
// bucket never passes through the stick, never goes through the ground, and
// empties over the spoil heap.

import type { Pose } from "@/lib/smoremodell";

export type Pt = { x: number; y: number };
/** A frame: origin and direction; local (u, v) is u along it, v to its left. */
export type Frame = { o: Pt; a: number };

/** Boom foot pin, on the upper frame. */
export const FOOT: Pt = { x: 1.2, y: 2.05 };
export const BOOM = 6.9;
export const STICK = 3.35;
/** On the bucket, from its main pin to the power-link pin. */
export const BUCKET_LINK = 0.52;
/** Idler link (stick to cylinder head) and power link (cylinder head to bucket). */
export const IDLER = 0.62;
export const POWER = 0.6;
/** Where the idler link pivots on the stick. */
export const IDLER_PIN: Pt = { x: 2.88, y: 0.24 };
/** Cylinder ends: boom cylinder base on the upper frame, the rest on boom and stick. */
export const BOOM_CYL_BASE: Pt = { x: 2.0, y: 1.45 };
export const BOOM_CYL_ROD: Pt = { x: 3.0, y: 0.25 };
export const STICK_CYL_BASE: Pt = { x: 3.15, y: 1.9 };
export const STICK_CYL_ROD: Pt = { x: -0.92, y: -0.12 };
export const BUCKET_CYL_BASE: Pt = { x: -0.22, y: 0.56 };

const rad = (d: number) => (d * Math.PI) / 180;

export const at = (f: Frame, u: number, v: number): Pt => ({
  x: f.o.x + u * Math.cos(f.a) - v * Math.sin(f.a),
  y: f.o.y + u * Math.sin(f.a) + v * Math.cos(f.a),
});

/** Where two circles meet, on the side `side` points to. */
function circles(a: Pt, ra: number, b: Pt, rb: number, side: Pt): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1e-6;
  const along = (ra * ra - rb * rb + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, ra * ra - along * along));
  const m = { x: a.x + (dx * along) / d, y: a.y + (dy * along) / d };
  const p1 = { x: m.x - (dy * h) / d, y: m.y + (dx * h) / d };
  const p2 = { x: m.x + (dy * h) / d, y: m.y - (dx * h) / d };
  const score = (p: Pt) => (p.x - m.x) * side.x + (p.y - m.y) * side.y;
  return score(p1) >= score(p2) ? p1 : p2;
}

/** Every frame and linkage point of the machine for a pose, in metres. */
export function solve(pose: Pose) {
  const boom: Frame = { o: FOOT, a: rad(pose.boom) };
  const tip = at(boom, BOOM, 0);
  const stick: Frame = { o: tip, a: boom.a + rad(pose.stick) };
  const pin = at(stick, STICK, 0);
  const bucket: Frame = { o: pin, a: stick.a + rad(pose.bucket) };
  const link = at(bucket, BUCKET_LINK, 0);
  const idler = at(stick, IDLER_PIN.x, IDLER_PIN.y);
  // The cylinder head sits where the idler and power links meet, on the
  // outer side of the stick (its local +v).
  const outer = { x: -Math.sin(stick.a), y: Math.cos(stick.a) };
  const head = circles(idler, IDLER, link, POWER, outer);
  return { boom, stick, bucket, tip, pin, link, idler, head };
}
export type Solved = ReturnType<typeof solve>;

/**
 * The bucket's side profile in its own frame (main pin at the origin, the
 * power-link pin along +u, the body below): top plate from the front corner
 * back to the rear corner, the wrapper round to the heel, the long floor, the
 * cutting edge and tooth well ahead of the top lip, and the raked mouth edge
 * back up. Modelled on a Cat GP bucket; tip radius about 2 m.
 */
export const BUCKET_SCALE = 0.88;
const B = ([u, v]: [number, number]): [number, number] => [u * BUCKET_SCALE, v * BUCKET_SCALE];
export const BUCKET_OUTLINE: [number, number][] = (
  [
    [-0.55, -0.3],
    [0.8, -0.22],
    [1.02, -0.36],
    [1.12, -0.75],
    [1.06, -1.15],
    [0.86, -1.52],
    [0.45, -1.82],
    [-0.2, -1.83],
    [-1.05, -1.76],
    [-1.45, -1.76],
    [-1.03, -1.62],
    [-0.78, -0.95],
  ] as [number, number][]
).map(B);
export const TOOTH: [number, number] = B([-1.45, -1.76]);

/** The stick's side outline in its frame (pivot at the origin, bucket pin at u = STICK). */
export const STICK_OUTLINE: [number, number][] = [
  [-1.02, -0.28],
  [-1.0, 0.0],
  [-0.86, 0.16],
  [-0.55, 0.36],
  [-0.2, 0.47],
  [0.25, 0.44],
  [2.95, 0.24],
  [3.35, 0.18],
  [3.5, 0.06],
  [3.45, -0.12],
  [3.3, -0.17],
  [0.45, -0.4],
  [-0.4, -0.48],
  [-0.75, -0.42],
];

/**
 * The trench: not drawn freehand but the hole the bucket's own cut carves —
 * the lowest the bucket outline reaches at each 0.1 m across the dig phase of
 * the cycle in lib/smoremodell.ts (DIG_KEYS), lightly smoothed. Regenerate it
 * if the dig keys change; tests/gravemaskin.test.ts checks they still agree.
 */
export const TRENCH: [number, number][] = [
  [6.7, 0], [6.8, -0.06], [6.9, -0.36], [7, -1.03], [7.1, -1.61], [7.2, -1.92], [7.3, -1.99], [7.4, -2.05], [7.5, -2.12],
  [7.6, -2.17], [7.7, -2.22], [7.8, -2.28], [7.9, -2.34], [8, -2.41], [8.1, -2.48], [8.2, -2.52], [8.3, -2.57], [8.4, -2.62],
  [8.5, -2.68], [8.6, -2.75], [8.7, -2.75], [8.8, -2.74], [8.9, -2.72], [9, -2.71], [9.1, -2.69], [9.2, -2.67], [9.3, -2.64],
  [9.4, -2.61], [9.5, -2.58], [9.6, -2.55], [9.7, -2.51], [9.8, -2.47], [9.9, -2.42], [10, -2.37], [10.1, -2.32], [10.2, -2.27],
  [10.3, -2.18], [10.4, -2.08], [10.5, -1.99], [10.6, -1.86], [10.7, -1.7], [10.8, -1.54], [10.9, -1.35], [11, -1.17],
  [11.1, -0.94], [11.2, -0.66], [11.3, 0],
];
/** The spoil heap right at the trench's far rim, where the bucket empties. */
export const HEAP = { centre: 12.5, half: 1.15, height: 1.05 };

/** The heap's profile: a low, rounded pile. */
export function heapAt(x: number) {
  const d = (x - HEAP.centre) / HEAP.half;
  return Math.abs(d) < 1 ? HEAP.height * Math.pow(1 - d * d, 0.75) : 0;
}

/** Ground height at x: the trench, the heap, or flat ground. */
export function groundAt(x: number) {
  if (x > TRENCH[0][0] && x < TRENCH[TRENCH.length - 1][0]) {
    const i = Math.min(TRENCH.length - 2, Math.floor((x - TRENCH[0][0]) / 0.1));
    const [x0, y0] = TRENCH[i];
    const [x1, y1] = TRENCH[i + 1];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return heapAt(x);
}

/** The bucket outline and stick outline in world metres, for a pose. */
export function outlines(pose: Pose) {
  const m = solve(pose);
  return {
    bucket: BUCKET_OUTLINE.map(([u, v]) => at(m.bucket, u, v)),
    stick: STICK_OUTLINE.map(([u, v]) => at(m.stick, u, v)),
    pin: m.pin,
  };
}
