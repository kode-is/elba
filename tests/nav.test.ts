import { describe, it, expect } from "vitest";
import { nav, navCta, servicesMenu, footerColumns, site } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

describe("site navigation", () => {
  it("has the four live nav links and the CTA", () => {
    expect(nav.map((n) => n.text)).toEqual(["Hjem", "Om oss", "Artikler", "Tjenester"]);
    expect(navCta).toEqual({ text: "Kontakt oss", href: "/kontakt-oss" });
  });
  it("Tjenester panel lists Anlegg, Industri, Produkter", () => {
    expect(servicesMenu.heading).toBe("Tjenester");
    expect(servicesMenu.description).toBe("Utforsk løsninger tilpasset din bransje og bruk");
    expect(servicesMenu.columns.flat().map((l) => l.href)).toEqual(["/anlegg", "/industri", "/produkter"]);
  });
  it("footer Selskapet column links to the five pages, Artikler fixed", () => {
    const links = footerColumns[0].links;
    expect(footerColumns[0].heading).toBe("Selskapet");
    expect(links.map((l) => l.text)).toEqual(["Hjem", "Om oss", "Artikler", "Tjenester", "Etikk og ansvar"]);
    expect(links.find((l) => l.text === "Artikler")?.href).toBe("/artikler");
    for (const l of links) expect(ROUTES).toContain(l.href);
  });
  it("company details are verbatim", () => {
    expect(site.address).toBe("Fabrikkgata 11D, 3320 Vestfossen");
    expect(site.phone).toBe("32 25 20 30");
    expect(site.email).toBe("elba@elba.no");
  });
});
