import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendApplication, APPLICATION_FAILURE } from "@/lib/email/send-application";
import { buildApplicationEmail, validateApplication, type ApplicationPayload } from "@/lib/email/application";

const ok: ApplicationPayload = { navn: "Ola Nordmann", telefon: "415 00 000", epost: "", melding: "" };

let envBackup: NodeJS.ProcessEnv;
beforeEach(() => {
  envBackup = { ...process.env };
  process.env.EMAIL_FROM = "Elba <web@elba.no>";
  process.env.CONTACT_TO = "elba@elba.no";
});
afterEach(() => {
  process.env = envBackup;
});

describe("validateApplication", () => {
  it("needs only a name and a phone number", () => {
    expect(validateApplication(ok)).toBeNull();
  });
  it("accepts common Norwegian phone formats", () => {
    for (const telefon of ["41500000", "+47 415 00 000", "0047-415-00-000", "(+47) 32 25 20 30"]) {
      expect(validateApplication({ ...ok, telefon }), telefon).toBeNull();
    }
  });
  it("rejects a missing name, a short phone number and a malformed optional e-mail", () => {
    expect(validateApplication({ ...ok, navn: " " })).toBe("Vennligst fyll inn navn.");
    expect(validateApplication({ ...ok, telefon: "1234" })).toBe("Vennligst oppgi et gyldig telefonnummer.");
    expect(validateApplication({ ...ok, telefon: "ring meg" })).toBe("Vennligst oppgi et gyldig telefonnummer.");
    expect(validateApplication({ ...ok, epost: "ola@" })).toBe("Vennligst oppgi en gyldig e-postadresse.");
  });
  it("fails the honeypot", () => {
    expect(validateApplication({ ...ok, website: "x" })).toBe("Sending mislyktes.");
  });
});

describe("buildApplicationEmail", () => {
  it("labels the subject as an application and strips header injection", () => {
    const mail = buildApplicationEmail({ ...ok, navn: "Ola\r\nBcc: x@y.z" });
    expect(mail.subject).toBe("Søknad fra elba.no – Ola Bcc: x@y.z");
  });
  it("escapes HTML and fills blanks with a dash", () => {
    const mail = buildApplicationEmail({ ...ok, melding: "<b>fagbrev</b>" });
    expect(mail.html).toContain("&lt;b&gt;fagbrev&lt;/b&gt;");
    expect(mail.text).toContain("E-post: -");
  });
});

describe("sendApplication", () => {
  it("does not send an invalid application", async () => {
    const send = vi.fn();
    expect(await sendApplication({ ...ok, telefon: "" }, send)).toEqual({
      ok: false,
      error: "Vennligst oppgi et gyldig telefonnummer.",
    });
    expect(send).not.toHaveBeenCalled();
  });
  it("sends to the shared inbox, without reply-to when no e-mail is given", async () => {
    const send = vi.fn().mockResolvedValue({ id: "1" });
    expect(await sendApplication(ok, send)).toEqual({ ok: true });
    const msg = send.mock.calls[0][0];
    expect(msg).toMatchObject({ from: "Elba <web@elba.no>", to: "elba@elba.no" });
    expect(msg).not.toHaveProperty("replyTo");
  });
  it("sets reply-to when an e-mail is given", async () => {
    const send = vi.fn().mockResolvedValue({ id: "1" });
    await sendApplication({ ...ok, epost: " ola@example.no " }, send);
    expect(send.mock.calls[0][0].replyTo).toBe("ola@example.no");
  });
  it("returns a friendly error when sending throws or the env is missing", async () => {
    expect(await sendApplication(ok, vi.fn().mockRejectedValue(new Error("boom")))).toEqual({
      ok: false,
      error: APPLICATION_FAILURE,
    });
    delete process.env.EMAIL_FROM;
    const send = vi.fn();
    expect(await sendApplication(ok, send)).toEqual({ ok: false, error: APPLICATION_FAILURE });
    expect(send).not.toHaveBeenCalled();
  });
});
