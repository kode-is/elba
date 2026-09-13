import { describe, it, expect } from "vitest";
import { servicesMenu } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

describe("servicesMenu", () => {
  it("has the heading and description verbatim", () => {
    expect(servicesMenu.heading).toBe("Þjónusta");
    expect(servicesMenu.description).toBe(
      "Okkar metnaður felst í vörugæðum og framúrskarandi þjónustu.",
    );
  });

  it("has two columns totalling the seven live-site links in order", () => {
    expect(servicesMenu.columns).toHaveLength(2);
    const links = servicesMenu.columns.flat();
    expect(links).toHaveLength(7);
    expect(links.map((link) => link.text)).toEqual([
      "Smurkerfi",
      "Sturtuvagnar",
      "Öryggisrúður",
      "Síubúnaður",
      "Fyrir ökumanninn",
      "Hífi- & festibúnaður",
      "Vetrarbúnaður",
    ]);
    expect(links.map((link) => link.href)).toEqual([
      "/smurkerfi",
      "/sturtuvagnar",
      "/oryggisrudur",
      "/siubunadur",
      "/fyrirokumannin",
      "/hifi-festibunadur",
      "/vetrarbunadur",
    ]);
  });

  it("every link href exists in lib/routes.ts", () => {
    for (const link of servicesMenu.columns.flat()) {
      expect(ROUTES).toContain(link.href);
    }
  });
});
