import { describe, it, expect } from "vitest";
import { ROUTES, PRODUKT_SLUGS, ARTIKKEL_SLUGS } from "@/lib/routes";
import { ROUTES as SCRIPT_ROUTES } from "../scripts/routes.mjs";

describe("lib/routes ROUTES", () => {
  it("matches scripts/routes.mjs exactly", () => {
    expect(ROUTES).toEqual(SCRIPT_ROUTES);
  });

  it("has 26 entries including /404", () => {
    expect(ROUTES).toHaveLength(26);
    expect(ROUTES).toContain("/404");
  });

  it("has 11 product and 5 article slugs", () => {
    expect(PRODUKT_SLUGS).toHaveLength(11);
    expect(ARTIKKEL_SLUGS).toHaveLength(5);
    expect(PRODUKT_SLUGS.every((s) => !s.includes("​"))).toBe(true);
  });
});
