import { describe, it, expect } from "vitest";
import { ROUTES } from "@/lib/routes";
import { ROUTES as SCRIPT_ROUTES } from "../scripts/routes.mjs";

describe("lib/routes ROUTES", () => {
  it("matches scripts/routes.mjs exactly", () => {
    expect(ROUTES).toEqual(SCRIPT_ROUTES);
  });

  it("has 57 entries including /404", () => {
    expect(ROUTES).toHaveLength(57);
    expect(ROUTES).toContain("/404");
  });
});
