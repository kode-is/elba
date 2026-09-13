export type ContactPayload = {
  nafn: string;
  netfang: string;
  simi: string;
  skilabod: string;
  /** Honeypot field — real visitors never fill this in. */
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates a contact payload, returning an Icelandic error message or null when valid. */
export function validateContact(p: ContactPayload): string | null {
  if (p.website) return "Sending mistókst.";
  if (!p.nafn?.trim()) return "Vinsamlegast fylltu út nafn.";
  if (!EMAIL_RE.test(p.netfang?.trim() ?? "")) return "Vinsamlegast sláðu inn gilt netfang.";
  if (!p.skilabod?.trim()) return "Vinsamlegast skrifaðu skilaboð.";
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
  const subject = `Fyrirspurn frá skralli.is – ${p.nafn.trim()}`;
  const text = [
    `Nafn: ${p.nafn}`,
    `Netfang: ${p.netfang}`,
    `Símanúmer: ${p.simi || "-"}`,
    "",
    "Skilaboð:",
    p.skilabod,
  ].join("\n");
  const html = `<p><strong>Nafn:</strong> ${esc(p.nafn)}</p><p><strong>Netfang:</strong> ${esc(p.netfang)}</p><p><strong>Símanúmer:</strong> ${esc(p.simi || "-")}</p><p><strong>Skilaboð:</strong></p><p>${esc(p.skilabod).replace(/\n/g, "<br/>")}</p>`;
  return { subject, text, html };
}
