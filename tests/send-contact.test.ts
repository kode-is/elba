import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendContact } from "@/lib/email/send-contact";
import type { ContactPayload } from "@/lib/email/contact";

const ok = { nafn: "Jón", netfang: "jon@example.is", simi: "8621234", skilabod: "Halló" };

let envBackup: NodeJS.ProcessEnv;

beforeEach(() => {
  envBackup = { ...process.env };
});

afterEach(() => {
  process.env = envBackup;
});

describe("sendContact", () => {
  it("returns validation error without sending", async () => {
    const send = vi.fn();
    const r = await sendContact({ ...ok, nafn: "" }, send);
    expect(r).toEqual({ ok: false, error: "Vinsamlegast fylltu út nafn." });
    expect(send).not.toHaveBeenCalled();
  });
  it("sends once with reply-to set to the sender", async () => {
    process.env.EMAIL_FROM = "Skralli <vefur@skralli.is>";
    process.env.CONTACT_TO = "skralli@skralli.is";
    const send = vi.fn().mockResolvedValue({ id: "1" });
    const r = await sendContact(ok, send);
    expect(r).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({ from: "Skralli <vefur@skralli.is>", to: "skralli@skralli.is", replyTo: "jon@example.is" });
  });
  it("returns a friendly error when sending throws", async () => {
    const send = vi.fn().mockRejectedValue(new Error("boom"));
    const r = await sendContact(ok, send);
    expect(r).toEqual({ ok: false, error: "Ekki tókst að senda skilaboðin. Reyndu aftur eða sendu póst á skralli@skralli.is." });
  });
  it("returns a friendly error for a malformed (non-object) payload instead of throwing", async () => {
    const send = vi.fn();
    const r = await sendContact(null as unknown as ContactPayload, send);
    expect(r).toEqual({ ok: false, error: "Ekki tókst að senda skilaboðin. Reyndu aftur eða sendu póst á skralli@skralli.is." });
    expect(send).not.toHaveBeenCalled();
  });
  it("returns a friendly error when required env vars are missing", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    const send = vi.fn();
    const r = await sendContact(ok, send);
    expect(r).toEqual({ ok: false, error: "Ekki tókst að senda skilaboðin. Reyndu aftur eða sendu póst á skralli@skralli.is." });
    expect(send).not.toHaveBeenCalled();
  });
});
