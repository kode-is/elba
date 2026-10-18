import { describe, expect, it } from "vitest";
import {
  clockLabel,
  cycleAt,
  dayClock,
  MANUAL_DAY_MS,
  CYCLE,
  DAY_MS,
  FEED_LINE,
  GREASE_END,
  greaseLevel,
  gunAt,
  LINES,
  lineEmissions,
  OPTIMAL,
  phaseOf,
  poseAt,
  STANDBY,
  STROKES_FROM,
  STROKES_TO,
} from "@/lib/smoremodell";

const day = Array.from({ length: 801 }, (_, i) => i / 800);

describe("grease model behind /anlegg's demo", () => {
  it("keeps the automatic system inside the right band all day", () => {
    for (const t of day) {
      const level = greaseLevel("automatisk", t);
      expect(level).toBeGreaterThanOrEqual(OPTIMAL.low);
      expect(level).toBeLessThanOrEqual(OPTIMAL.high);
    }
  });

  it("overshoots by hand right after the gun, settles into the band, and thins below it by afternoon", () => {
    expect(greaseLevel("manuell", GREASE_END)).toBeGreaterThan(OPTIMAL.high);
    expect(greaseLevel("manuell", GREASE_END + 0.15)).toBeLessThanOrEqual(OPTIMAL.high);
    expect(greaseLevel("manuell", GREASE_END + 0.15)).toBeGreaterThanOrEqual(OPTIMAL.low);
    expect(greaseLevel("manuell", 7 / 8)).toBeLessThan(OPTIMAL.low);
  });

  it("loops: the day ends where the next one starts", () => {
    for (const mode of ["automatisk", "manuell"] as const) {
      expect(Math.abs(greaseLevel(mode, 0.9999) - greaseLevel(mode, 0))).toBeLessThan(2);
    }
  });

  it("doses only while the pump runs, and reaches every point in every run", () => {
    for (let line = 0; line < LINES; line++) {
      const e = lineEmissions(line);
      expect(e.length).toBeGreaterThan(0);
      for (const at of e) {
        expect(at).toBeGreaterThanOrEqual(STROKES_FROM);
        expect(at).toBeLessThanOrEqual(STROKES_TO);
      }
    }
    // The secondary divider starts only once the feed line from the main divider has delivered.
    const firstFeed = lineEmissions(FEED_LINE)[0];
    for (let line = FEED_LINE + 1; line < LINES; line++) expect(lineEmissions(line)[0]).toBeGreaterThan(firstFeed);
    // Both dividers work at the same time: main-divider doses continue after the secondary has begun.
    expect(Math.max(...lineEmissions(0))).toBeGreaterThan(lineEmissions(FEED_LINE + 1)[0]);
  });

  it("holds each status phase for at least a second", () => {
    const seen: { phase: string; from: number }[] = [];
    for (let t = 0; t < 1; t += 0.0002) {
      const p = phaseOf(cycleAt(t).u);
      if (!seen.length || seen[seen.length - 1].phase !== p) seen.push({ phase: p, from: t });
    }
    for (let i = 1; i < seen.length - 1; i++) expect((seen[i + 1].from - seen[i].from) * DAY_MS).toBeGreaterThan(1000);
    expect(CYCLE * DAY_MS).toBeGreaterThan(2000);
  });

  it("parks the machine for the grease gun, then digs", () => {
    expect(gunAt(0.05, 11)).not.toBeNull();
    expect(poseAt("manuell", 0.05)).toEqual(STANDBY);
    expect(gunAt(0.5, 11)).toBeNull();
    expect(poseAt("manuell", 0.5)).not.toEqual(STANDBY);
  });

  it("plays the manual greasing round at the normal pace, then runs the rest of the day faster", () => {
    expect(dayClock("manuell", GREASE_END * DAY_MS)).toEqual({ t: GREASE_END, motion: GREASE_END });
    const late = dayClock("manuell", MANUAL_DAY_MS - 1);
    expect(late.t).toBeGreaterThan(0.99);
    // The machine keeps moving at its own pace; only the clock runs faster.
    expect(late.motion).toBeCloseTo((MANUAL_DAY_MS - 1) / DAY_MS);
    expect(MANUAL_DAY_MS).toBeLessThan(DAY_MS / 2);
    expect(dayClock("automatisk", 30000)).toEqual({ t: 0.5, motion: 0.5 });
  });

  it("labels the clock from 07:00 to 15:00", () => {
    expect(clockLabel(0)).toBe("07:00");
    expect(clockLabel(0.5)).toBe("11:00");
    expect(clockLabel(0.9999)).toBe("14:59");
  });
});
