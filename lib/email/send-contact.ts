import { validateContact, buildContactEmail, type ContactPayload } from "@/lib/email/contact";
import { getResendClient, emailFrom, contactTo } from "@/lib/email/client";

export type ContactResult = { ok: true } | { ok: false; error: string };

export type SendFn = (msg: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}) => Promise<unknown>;

async function defaultSend(msg: Parameters<SendFn>[0]) {
  const { error } = await getResendClient().emails.send(msg);
  if (error) throw new Error(error.message);
}

/**
 * Injectable core of the contact flow: validate, build the email, hand it to
 * `send`. Kept separate from the "use server" action file because Next.js
 * server actions may only take serializable arguments — a function like the
 * test double used here can't cross that boundary.
 */
export async function sendContact(payload: ContactPayload, send: SendFn = defaultSend): Promise<ContactResult> {
  try {
    const err = validateContact(payload);
    if (err) return { ok: false, error: err };
    const mail = buildContactEmail(payload);
    await send({ from: emailFrom(), to: contactTo(), replyTo: payload.netfang.trim(), ...mail });
    return { ok: true };
  } catch (e) {
    // Catches a malformed (non-object) payload from validateContact as well
    // as a missing EMAIL_FROM/RESEND_API_KEY env var from emailFrom()/send,
    // in addition to the send call itself throwing.
    console.error("contact send failed", e instanceof Error ? e.message : e);
    return { ok: false, error: "Ekki tókst að senda skilaboðin. Reyndu aftur eða sendu póst á skralli@skralli.is." };
  }
}
