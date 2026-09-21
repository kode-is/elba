import { describe, it, expect } from "vitest";
import { team } from "@/lib/team";

describe("team", () => {
  it("has the ten members in order with role, and email where known", () => {
    expect(team.map((m) => m.name)).toEqual([
      "Ronny Thoresen", "Haavard Gaathaug", "Hege Hersæther", "Adrian Myrvold",
      "H. Isak Vilmundarson", "Christoffer Iversen", "Sondre Hovde Bamrud", "Mantas Jokubaitis", "Simen Kvernstad", "Eva Hansen",
    ]);
    for (const m of team) { expect(m.role).toBeTruthy(); if (m.email) expect(m.email).toMatch(/@elba\.no$/); expect(m.image.src).toMatch(/^\/images\/om-oss\//); }
    expect(team.find((m) => m.name === "Christoffer Iversen")?.phone).toBe("776 4836");
  });
});
