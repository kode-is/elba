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
export const STICK_CYL_BASE: Pt = { x: 3.15, y: 2.05 };
/** On the stick's cranked top end, so the cylinder rides above the boom even with the stick well out. */
export const STICK_CYL_ROD: Pt = { x: -1.05, y: 0.35 };
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
 * cutting edge and tooth well ahead of the top lip, and the mouth edge
 * curving in on its way back up. Modelled on a Cat GP bucket; tip radius about 2 m.
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
    // The mouth edge, curving in towards the back (MOUTH_EDGE)
    [-0.769, -1.341],
    [-0.603, -1.027],
    [-0.529, -0.681],
  ] as [number, number][]
).map(B);
export const TOOTH: [number, number] = B([-1.45, -1.76]);
/** The side plate's front edge, from the top lip down to the cutting edge, as a cubic (unscaled bucket units). */
export const MOUTH_EDGE: [number, number][] = [
  [-0.55, -0.3],
  [-0.46, -0.83],
  [-0.62, -1.27],
  [-1.03, -1.62],
];

/** The stick's side outline in its frame (pivot at the origin, bucket pin at u = STICK). */
export const STICK_OUTLINE: [number, number][] = [
  [-1.0, -0.3],
  [-1.16, 0.0],
  [-1.18, 0.3],
  [-1.1, 0.52],
  [-0.9, 0.58],
  [-0.5, 0.56],
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

/** The boom's top edge over its forward section, in the boom frame (u from the knee to the tip). */
export function boomTopAt(u: number) {
  return 1.42 - ((u - 3.7) * 1.08) / 3.25;
}
/** The stick cylinder's radius, for clearance over the boom. */
export const STICK_CYL_RADIUS = 0.15;

/**
 * The trench is the path of the bucket's tooth: the lowest the tooth tip
 * reaches at each 5 cm across the cut in lib/smoremodell.ts (DIG_KEYS) —
 * down the ramp at the far end, along the floor, up the near wall. The rest of
 * the bucket rides inside the cut above it. Regenerate it if the dig keys
 * change; tests/gravemaskin.test.ts checks they still agree.
 */
export const TRENCH: [number, number][] = [
  [7.25, 0], [7.3, -1.29], [7.35, -1.55], [7.4, -1.71], [7.45, -1.84], [7.5, -1.95], [7.55, -2.03], [7.6, -2.11],
  [7.65, -2.18], [7.7, -2.24], [7.75, -2.29], [7.8, -2.34], [7.85, -2.39], [7.9, -2.41], [7.95, -2.41], [8, -2.42],
  [8.05, -2.42], [8.1, -2.43], [8.15, -2.43], [8.2, -2.44], [8.25, -2.44], [8.3, -2.44], [8.35, -2.45], [8.4, -2.45],
  [8.45, -2.45], [8.5, -2.45], [8.55, -2.45], [8.6, -2.45], [8.65, -2.44], [8.7, -2.42], [8.75, -2.4], [8.8, -2.38],
  [8.85, -2.36], [8.9, -2.35], [8.95, -2.32], [9, -2.3], [9.05, -2.28], [9.1, -2.26], [9.15, -2.24], [9.2, -2.21],
  [9.25, -2.19], [9.3, -2.16], [9.35, -2.14], [9.4, -2.11], [9.45, -2.08], [9.5, -2.03], [9.55, -1.99], [9.6, -1.95],
  [9.65, -1.89], [9.7, -1.85], [9.75, -1.8], [9.8, -1.75], [9.85, -1.71], [9.9, -1.65], [9.95, -1.6], [10, -1.55],
  [10.05, -1.49], [10.1, -1.44], [10.15, -1.39], [10.2, -1.33], [10.25, -1.28], [10.3, -1.23], [10.35, -1.18],
  [10.4, -1.13], [10.45, -1.08], [10.5, -1.03], [10.55, -0.98], [10.6, -0.92], [10.65, -0.87], [10.7, -0.81],
  [10.75, -0.75], [10.8, -0.7], [10.85, -0.63], [10.9, -0.57], [10.95, -0.5], [11, -0.44], [11.05, -0.36],
  [11.1, -0.28], [11.15, -0.21], [11.2, -0.12], [11.25, -0.03], [11.3, 0],
];
/** The spoil heap just beyond the trench's far end, where the bucket empties. */
export const HEAP = { centre: 12.5, half: 1.15, height: 1.05 };

/** The heap's profile: a low, rounded pile. */
export function heapAt(x: number) {
  const d = (x - HEAP.centre) / HEAP.half;
  return Math.abs(d) < 1 ? HEAP.height * Math.pow(1 - d * d, 0.75) : 0;
}

/** Ground height at x: the trench, the heap, or flat ground. */
export function groundAt(x: number) {
  if (x > TRENCH[0][0] && x < TRENCH[TRENCH.length - 1][0]) {
    let i = 0;
    while (i < TRENCH.length - 2 && TRENCH[i + 1][0] < x) i++;
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
