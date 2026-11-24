import { validateApplication, buildApplicationEmail, type ApplicationPayload } from "@/lib/email/application";
import { getResendClient, emailFrom, contactTo } from "@/lib/email/client";

export type ApplicationResult = { ok: true } | { ok: false; error: string };

export type SendApplicationFn = (msg: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}) => Promise<unknown>;

async function defaultSend(msg: Parameters<SendApplicationFn>[0]) {
  const { error } = await getResendClient().emails.send(msg);
  if (error) throw new Error(error.message);
}

export const APPLICATION_FAILURE =
  "Kunne ikke sende søknaden. Prøv igjen, ring oss på 32 25 20 30 eller send e-post til elba@elba.no.";

/**
 * Same shape as lib/email/send-contact.ts: validate, build, hand to `send`.
 * Applications go to the same inbox as contact requests (CONTACT_TO,
 * elba@elba.no); the subject line ("Søknad fra elba.no – …") tells them apart.
 */
export async function sendApplication(
  payload: ApplicationPayload,
  send: SendApplicationFn = defaultSend,
): Promise<ApplicationResult> {
  try {
    const err = validateApplication(payload);
    if (err) return { ok: false, error: err };
    const mail = buildApplicationEmail(payload);
    const epost = payload.epost?.trim();
    await send({ from: emailFrom(), to: contactTo(), ...(epost ? { replyTo: epost } : {}), ...mail });
    return { ok: true };
  } catch (e) {
    console.error("application send failed", e instanceof Error ? e.message : e);
    return { ok: false, error: APPLICATION_FAILURE };
  }
}
