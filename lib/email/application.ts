// The application form on /jobb-hos-oss (components/jobb/ApplicationForm.tsx).
// Built for someone who has just scanned a QR code on a phone, so it asks for
// as little as possible: a name and a phone number are enough for ELBA to
// call back. E-post and a few lines about yourself are optional.

export type ApplicationPayload = {
  navn: string;
  telefon: string;
  epost: string;
  /** Free text: experience, fagbrev, where you live — whatever the applicant wants to say. */
  melding: string;
  /** Honeypot field — real visitors never fill this in. */
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** At least eight digits once spaces, dashes, dots and brackets are removed; an optional leading +. */
const PHONE_RE = /^\+?\d{8,15}$/;

export const normalizePhone = (s: string) => s.replace(/[\s\-.()]/g, "");

/** Validates an application, returning a Norwegian error message or null when valid. */
export function validateApplication(p: ApplicationPayload): string | null {
  if (p.website) return "Sending mislyktes.";
  if (!p.navn?.trim()) return "Vennligst fyll inn navn.";
  if (!PHONE_RE.test(normalizePhone(p.telefon ?? ""))) return "Vennligst oppgi et gyldig telefonnummer.";
  const epost = p.epost?.trim() ?? "";
  if (epost && !EMAIL_RE.test(epost)) return "Vennligst oppgi en gyldig e-postadresse.";
  return null;
}

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]!);

export function buildApplicationEmail(p: ApplicationPayload): { subject: string; text: string; html: string } {
  // Single mail header: collapse CR/LF so a name can't inject headers (same
  // rule as lib/email/contact.ts).
  const navn = p.navn.trim().replace(/[\r\n]+/g, " ").slice(0, 120);
  const subject = `Søknad fra elba.no – ${navn}`;
  const melding = p.melding?.trim() || "-";
  const epost = p.epost?.trim() || "-";
  const text = [`Navn: ${p.navn}`, `Telefon: ${p.telefon}`, `E-post: ${epost}`, "", "Om søkeren:", melding].join("\n");
  const html = `<p><strong>Navn:</strong> ${esc(p.navn)}</p><p><strong>Telefon:</strong> ${esc(p.telefon)}</p><p><strong>E-post:</strong> ${esc(epost)}</p><p><strong>Om søkeren:</strong></p><p>${esc(melding).replace(/\n/g, "<br/>")}</p>`;
  return { subject, text, html };
}
