import { Resend } from "resend";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable ${name}`);
  return v;
}

export function emailFrom(): string {
  return requireEnv("EMAIL_FROM");
}

export function contactTo(): string {
  return process.env.CONTACT_TO || "skralli@skralli.is";
}

let cached: { key: string; client: Resend } | null = null;

/** Lazily constructs a Resend client and caches it for the lifetime of the process. */
export function getResendClient(): Resend {
  const key = requireEnv("RESEND_API_KEY");
  if (cached?.key === key) return cached.client;
  cached = { key, client: new Resend(key) };
  return cached.client;
}
