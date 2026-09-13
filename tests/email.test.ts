import { describe, it, expect } from "vitest";
import { validateContact, buildContactEmail } from "@/lib/email/contact";

const ok = { navn: "Ola", epost: "ola@example.no", selskap: "Elba AS", melding: "Hei" };

describe("validateContact", () => {
  it("accepts a full payload", () => expect(validateContact(ok)).toBeNull());
  it("accepts an empty company", () => expect(validateContact({ ...ok, selskap: "" })).toBeNull());
  it("requires name", () => expect(validateContact({ ...ok, navn: " " })).toBe("Vennligst fyll inn navn."));
  it("requires valid email", () => expect(validateContact({ ...ok, epost: "x" })).toBe("Vennligst oppgi en gyldig e-postadresse."));
  it("requires message", () => expect(validateContact({ ...ok, melding: "" })).toBe("Vennligst skriv en melding."));
  it("rejects honeypot", () => expect(validateContact({ ...ok, website: "spam" })).toBe("Sending mislyktes."));
});

describe("buildContactEmail", () => {
  it("puts name in subject and all fields in body", () => {
    const m = buildContactEmail(ok);
    expect(m.subject).toBe("Henvendelse fra elba.no – Ola");
    expect(m.text).toContain("Navn: Ola");
    expect(m.text).toContain("E-post: ola@example.no");
    expect(m.text).toContain("Selskap: Elba AS");
    expect(m.text).toContain("Hei");
    expect(m.html).toContain("<strong>Navn:</strong> Ola");
  });
  it("prints a dash for an empty company", () => {
    expect(buildContactEmail({ ...ok, selskap: "" }).text).toContain("Selskap: -");
  });
  it("escapes html in message", () => {
    expect(buildContactEmail({ ...ok, melding: "<b>x</b>" }).html).not.toContain("<b>x</b>");
  });
  it("keeps the subject on one line", () => {
    const m = buildContactEmail({ ...ok, navn: "Ola\r\nBcc: x@y.z" });
    expect(m.subject).not.toContain("\r");
    expect(m.subject).not.toContain("\n");
  });
});
