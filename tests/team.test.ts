import { describe, it, expect } from "vitest";
import { team } from "@/lib/team";

describe("team", () => {
  it("has the nine members in live order with role and email", () => {
    expect(team.map((m) => m.name)).toEqual([
      "Ronny Thoresen", "Haavard Gaathaug", "Hege Hersæther", "Adrian Myrvold", "Lukas Sundby Baklid",
      "H. Isak Vilmundarson", "Christoffer Iversen", "Sondre Hovde Bamrud", "Eva Hansen",
    ]);
    for (const m of team) { expect(m.role).toBeTruthy(); expect(m.email).toMatch(/@elba\.no$/); expect(m.image.src).toMatch(/^\/images\/om-oss\//); }
    expect(team.find((m) => m.name === "Christoffer Iversen")?.phone).toBe("776 4836");
  });
});
