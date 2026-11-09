import { describe, expect, it } from "vitest";
import {
  at,
  BOOM,
  boomTopAt,
  groundAt,
  HEAP,
  heapAt,
  outlines,
  solve,
  STICK_CYL_BASE,
  STICK_CYL_RADIUS,
  STICK_CYL_ROD,
  TOOTH,
  TRENCH,
  type Pt,
} from "@/lib/gravemaskin";
import { bucketAttitude, CUT, digPose, GREASE_END, DIG, loadAt, poseAt, SPILL, STANDBY } from "@/lib/smoremodell";
import type { Pose } from "@/lib/smoremodell";

function inside(poly: Pt[], p: Pt) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}

/** The bucket outline, densely sampled along its edges. */
function bucketEdge(pose: Pose) {
  const { bucket } = outlines(pose);
  const pts: Pt[] = [];
  for (let i = 0; i < bucket.length; i++) {
    const a = bucket[i];
    const b = bucket[(i + 1) % bucket.length];
    for (let k = 0; k < 6; k++) pts.push({ x: a.x + ((b.x - a.x) * k) / 6, y: a.y + ((b.y - a.y) * k) / 6 });
  }
  return pts;
}

const phases = Array.from({ length: 501 }, (_, i) => i / 500);
/** Leaving the greasing position, in the manual day. */
const exit = Array.from({ length: 61 }, (_, i) => GREASE_END + (DIG * 0.4 * i) / 60).map((t) => poseAt("manuell", t));

describe("the excavator in /anlegg's demo", () => {
  it("never curls the bucket through the stick", () => {
    for (const pose of [...phases.map(digPose), ...exit, STANDBY]) {
      const { stick, pin } = outlines(pose);
      // The ears straddle the stick nose, so the area right round the pin may overlap.
      const through = bucketEdge(pose).filter((p) => Math.hypot(p.x - pin.x, p.y - pin.y) > 0.42 && inside(stick, p));
      expect(through).toEqual([]);
    }
  });

  it("never takes the bucket through the ground, trench or heap", () => {
    for (const pose of [...phases.map(digPose), ...exit, STANDBY]) {
      for (const p of bucketEdge(pose)) expect(p.y).toBeGreaterThan(groundAt(p.x) - 0.06);
    }
  });

  it("rests the bucket on the ground for greasing", () => {
    const low = Math.min(...bucketEdge(STANDBY).map((p) => p.y));
    expect(Math.abs(low)).toBeLessThan(0.06);
  });

  it("draws the trench as the path of the bucket's tooth", () => {
    const deepest = new Map<number, number>();
    for (let ph = CUT.from; ph <= CUT.to; ph += 0.0005) {
      const tip = at(solve(digPose(ph)).bucket, TOOTH[0], TOOTH[1]);
      if (tip.y >= 0) continue;
      const k = Math.round(tip.x * 20);
      deepest.set(k, Math.min(deepest.get(k) ?? 0, tip.y));
    }
    for (const [x, y] of TRENCH.slice(1, -1)) expect(Math.abs((deepest.get(Math.round(x * 20)) ?? 0) - y)).toBeLessThan(0.03);
  });

  it("carries the load curled and only empties it over the spoil heap", () => {
    for (let ph = 0.2; ph < 1; ph += 0.002) {
      const p = digPose(ph);
      if (loadAt(ph, p) === 0 || bucketAttitude(p) < SPILL.from) continue;
      // Soil is sliding out: the mouth must be over the heap, and above it.
      const mouth = at(solve(p).bucket, -0.7, -0.84);
      expect(mouth.x).toBeGreaterThan(HEAP.centre - HEAP.half - 0.1);
      expect(mouth.x).toBeLessThan(HEAP.centre + HEAP.half);
      expect(mouth.y).toBeGreaterThan(heapAt(mouth.x) + 0.3);
    }
  });

  it("keeps the stick cylinder riding above the boom", () => {
    for (const pose of [...phases.map(digPose), ...exit, STANDBY]) {
      // The stick's top end, in the boom's frame.
      const g = (pose.stick * Math.PI) / 180;
      const tail = {
        x: BOOM + STICK_CYL_ROD.x * Math.cos(g) - STICK_CYL_ROD.y * Math.sin(g),
        y: STICK_CYL_ROD.x * Math.sin(g) + STICK_CYL_ROD.y * Math.cos(g),
      };
      for (let f = 0; f <= 1; f += 0.02) {
        const u = STICK_CYL_BASE.x + (tail.x - STICK_CYL_BASE.x) * f;
        const v = STICK_CYL_BASE.y + (tail.y - STICK_CYL_BASE.y) * f;
        if (u >= 3.7 && u <= 6.95) expect(v - STICK_CYL_RADIUS).toBeGreaterThan(boomTopAt(u) + 0.05);
      }
    }
  });

  it("keeps the bucket linkage short of folding over", () => {
    for (const pose of [...phases.map(digPose), ...exit, STANDBY]) expect(pose.bucket).toBeLessThanOrEqual(125);
  });
});
