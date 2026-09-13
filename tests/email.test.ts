import { describe, it, expect } from "vitest";
import { validateContact, buildContactEmail } from "@/lib/email/contact";

const ok = { nafn: "Jón", netfang: "jon@example.is", simi: "8621234", skilabod: "Halló" };

describe("validateContact", () => {
  it("accepts a full payload", () => expect(validateContact(ok)).toBeNull());
  it("requires name", () => expect(validateContact({ ...ok, nafn: " " })).toBe("Vinsamlegast fylltu út nafn."));
  it("requires valid email", () => expect(validateContact({ ...ok, netfang: "x" })).toBe("Vinsamlegast sláðu inn gilt netfang."));
  it("requires message", () => expect(validateContact({ ...ok, skilabod: "" })).toBe("Vinsamlegast skrifaðu skilaboð."));
  it("rejects honeypot", () => expect(validateContact({ ...ok, website: "spam" })).toBe("Sending mistókst."));
});

describe("buildContactEmail", () => {
  it("puts name in subject and all fields in body", () => {
    const m = buildContactEmail(ok);
    expect(m.subject).toBe("Fyrirspurn frá skralli.is – Jón");
    expect(m.text).toContain("Nafn: Jón");
    expect(m.text).toContain("Netfang: jon@example.is");
    expect(m.text).toContain("Símanúmer: 8621234");
    expect(m.text).toContain("Halló");
    expect(m.html).toContain("<strong>Nafn:</strong> Jón");
  });
  it("escapes html in message", () => {
    expect(buildContactEmail({ ...ok, skilabod: "<b>x</b>" }).html).not.toContain("<b>x</b>");
  });
});
