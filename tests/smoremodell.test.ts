import { describe, expect, it } from "vitest";
import {
  clockLabel,
  cycleAt,
  GREASE_END,
  greaseLevel,
  gunAt,
  OPTIMAL,
  outletTravel,
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

  it("serves the six outlets one after another within a cycle", () => {
    const { u } = cycleAt(0.05 + 1 / 6 + 0.06);
    expect(u).not.toBeNull();
    const moving = [0, 1, 2, 3, 4, 5].filter((i) => outletTravel(u, i) !== null);
    expect(moving.length).toBeGreaterThan(0);
    expect(moving.length).toBeLessThan(6);
    expect(cycleAt(0.01).u).toBeNull();
  });

  it("parks the machine for the grease gun, then digs", () => {
    expect(gunAt(0.05)).not.toBeNull();
    expect(poseAt("manuell", 0.05)).toEqual(STANDBY);
    expect(gunAt(0.5)).toBeNull();
    expect(poseAt("manuell", 0.5)).not.toEqual(STANDBY);
  });

  it("labels the clock from 07:00 to 15:00", () => {
    expect(clockLabel(0)).toBe("07:00");
    expect(clockLabel(0.5)).toBe("11:00");
    expect(clockLabel(0.9999)).toBe("14:59");
  });
});
