import { describe, it, expect } from "vitest";
import { productSize, productFacts } from "@/lib/product-facts";
import { wagonGroups, wagons } from "@/lib/sturtuvagnar";

// lib/product-facts.ts derives the design-redesign fact strip
// (design.dc.html 1a/1d "Staðreyndastrimill") from data already in
// lib/sturtuvagnar.ts — nothing here is invented. Two of 25 blurbs carry a
// "NxNxN sm" size (gw-100, gw-120); only the fjorhjola-minigrofuvagnar
// group's "Um X" text carries a "N gráðu sturtuhalla" angle.
const gw100 = wagons.find((w) => w.slug === "gw-100")!;
const fjorhjolaGroup = wagonGroups.find((g) => g.id === "fjorhjola-minigrofuvagnar")!;

const gd2_6x = wagons.find((w) => w.slug === "hjolagrofuvagn-gd2-6x")!;
const hjolagrofuGroup = wagonGroups.find((g) => g.id === "hjolagrofuvagnar")!;

describe("productSize", () => {
  it("extracts a NxNxN sm size from a blurb, using × (U+00D7)", () => {
    expect(productSize(gw100.blurb)).toBe("150×100×35 sm");
  });

  it("returns null when the blurb has no size", () => {
    expect(productSize(gd2_6x.blurb)).toBeNull();
  });
});

describe("productFacts", () => {
  it("returns 6 facts, in order, for a product with both size and angle", () => {
    const facts = productFacts(gw100, fjorhjolaGroup);
    expect(facts.map((f) => f.label)).toEqual([
      "Stærð",
      "Flokkur",
      "Framleiðandi",
      "Framleitt í",
      "Ábyrgð",
      "Sturtuhalli",
    ]);
    expect(facts).toHaveLength(6);
    expect(facts.find((f) => f.label === "Stærð")?.value).toBe("150×100×35 sm");
    expect(facts.find((f) => f.label === "Sturtuhalli")?.value).toBe("u.þ.b. 50°");
  });

  it("returns 4 facts, omitting Stærð and Sturtuhalli, for a product with neither", () => {
    const facts = productFacts(gd2_6x, hjolagrofuGroup);
    expect(facts.map((f) => f.label)).toEqual([
      "Flokkur",
      "Framleiðandi",
      "Framleitt í",
      "Ábyrgð",
    ]);
    expect(facts).toHaveLength(4);
  });

  it("Ábyrgð always carries tone: \"green\"", () => {
    const facts = productFacts(gw100, fjorhjolaGroup);
    const abyrgd = facts.find((f) => f.label === "Ábyrgð");
    expect(abyrgd?.value).toBe("5 ára");
    expect(abyrgd?.tone).toBe("green");
  });

  it("Flokkur is the group's title, and Framleiðandi/Framleitt í are fixed", () => {
    const facts = productFacts(gd2_6x, hjolagrofuGroup);
    expect(facts.find((f) => f.label === "Flokkur")?.value).toBe(hjolagrofuGroup.title);
    expect(facts.find((f) => f.label === "Framleiðandi")?.value).toBe("Gigant");
    expect(facts.find((f) => f.label === "Framleitt í")?.value).toBe("Noregi");
  });
});
