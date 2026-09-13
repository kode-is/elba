export type ContactPayload = {
  navn: string;
  epost: string;
  selskap: string;
  melding: string;
  /** Honeypot field — real visitors never fill this in. */
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates a contact payload, returning a Norwegian error message or null when valid. */
export function validateContact(p: ContactPayload): string | null {
  if (p.website) return "Sending mislyktes.";
  if (!p.navn?.trim()) return "Vennligst fyll inn navn.";
  if (!EMAIL_RE.test(p.epost?.trim() ?? "")) return "Vennligst oppgi en gyldig e-postadresse.";
  if (!p.melding?.trim()) return "Vennligst skriv en melding.";
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

export function buildContactEmail(p: ContactPayload): { subject: string; text: string; html: string } {
  const subject = `Henvendelse fra elba.no – ${p.navn.trim()}`;
  const text = [
    `Navn: ${p.navn}`,
    `E-post: ${p.epost}`,
    `Selskap: ${p.selskap || "-"}`,
    "",
    "Melding:",
    p.melding,
  ].join("\n");
  const html = `<p><strong>Navn:</strong> ${esc(p.navn)}</p><p><strong>E-post:</strong> ${esc(p.epost)}</p><p><strong>Selskap:</strong> ${esc(p.selskap || "-")}</p><p><strong>Melding:</strong></p><p>${esc(p.melding).replace(/\n/g, "<br/>")}</p>`;
  return { subject, text, html };
}
