import { describe, expect, it } from "vitest";
import {
  clockLabel,
  cycleAt,
  GREASE_END,
  greaseLevel,
  gunAt,
  lineStart,
  lineTravel,
  LINES,
  MAIN_OUTLETS,
  OPTIMAL,
  phaseOf,
  poseAt,
  STANDBY,
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

  it("has manual greasing too high in the morning and too low by the afternoon", () => {
    expect(greaseLevel("manuell", GREASE_END + 0.01)).toBeGreaterThan(OPTIMAL.high);
    expect(greaseLevel("manuell", 7 / 8)).toBeLessThan(OPTIMAL.low);
  });

  it("loops: the day ends where the next one starts", () => {
    for (const mode of ["automatisk", "manuell"] as const) {
      expect(Math.abs(greaseLevel(mode, 0.9999) - greaseLevel(mode, 0))).toBeLessThan(2);
    }
  });

  it("serves the main divider's outlets in turn, then the secondary divider's", () => {
    const starts = Array.from({ length: LINES }, (_, i) => lineStart(i));
    for (let i = 1; i < LINES; i++) expect(starts[i]).toBeGreaterThan(starts[i - 1]);
    // The secondary divider only starts once the main divider's last line has delivered.
    expect(starts[MAIN_OUTLETS]).toBeGreaterThanOrEqual(lineStart(MAIN_OUTLETS - 1) + 0.1);
    expect(lineStart(LINES - 1) + 0.08).toBeLessThanOrEqual(1);
    const { u } = cycleAt(0.03 + 1 / 6 + 0.04);
    expect(u).not.toBeNull();
    const moving = Array.from({ length: LINES }, (_, i) => i).filter((i) => lineTravel(u, i) !== null);
    expect(moving.length).toBeGreaterThan(0);
    expect(moving.length).toBeLessThan(4);
    expect(cycleAt(0.01).u).toBeNull();
  });

  it("holds each status phase for at least a second", () => {
    const seen: { phase: string; from: number }[] = [];
    for (let t = 0; t < 1; t += 0.0005) {
      const p = phaseOf(cycleAt(t).u);
      if (!seen.length || seen[seen.length - 1].phase !== p) seen.push({ phase: p, from: t });
    }
    for (let i = 1; i < seen.length - 1; i++) expect((seen[i + 1].from - seen[i].from) * 60).toBeGreaterThan(1);
  });

  it("parks the machine for the grease gun, then digs", () => {
    expect(gunAt(0.05, 10)).not.toBeNull();
    expect(poseAt("manuell", 0.05)).toEqual(STANDBY);
    expect(gunAt(0.5, 10)).toBeNull();
    expect(poseAt("manuell", 0.5)).not.toEqual(STANDBY);
  });

  it("labels the clock from 07:00 to 15:00", () => {
    expect(clockLabel(0)).toBe("07:00");
    expect(clockLabel(0.5)).toBe("11:00");
    expect(clockLabel(0.9999)).toBe("14:59");
  });
});
