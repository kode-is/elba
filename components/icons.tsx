// Small hand-drawn glyph set for red icon badges that Task 7's routes show
// but that the scraper never captured as a standalone asset — the same
// situation components/home/AdvisorySection.tsx already documents for its
// own CalendarIcon/ClockIcon ("Not captured standalone in docs/scrape/svg/
// ... plain glyphs for the key points' red badges"). Shared here because
// several of these badges repeat verbatim across /anlegg, /industri and
// /etikk-og-ansvar (e.g. both "Nøkkelfunksjoner" and "Industriell
// pålitelighet" reuse the same "Forlenget levetid" / "Økt sikkerhet" cards).
// Sizing/colour is the caller's responsibility via `className`.

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

type IconProps = { className?: string };

/** Checkmark used by the plain "Oversikt / Varsling / Sporbarhet"-style key-point lists (docs/reference/anlegg.desktop.jpg, industri.desktop.jpg). */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M4 12.5l5 5L20 7" />
    </svg>
  );
}

/** "Jevn dosering" (anlegg Nøkkelfunksjoner). */
export function TargetIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

/** "Redusert nedetid" / "Maksimert oppetid" / "Forlenget levetid". */
export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/** "Økt sikkerhet" (anlegg + industri). */
export function HardHatIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M4 16a8 8 0 0116 0" />
      <path d="M3 16h18" />
      <path d="M12 8V5" />
    </svg>
  );
}

/** "Lavere kostnader" / "Lavere vedlikeholdskostnader". */
export function CoinsIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <ellipse cx="9" cy="8" rx="6" ry="3" />
      <path d="M3 8v4c0 1.66 2.69 3 6 3s6-1.34 6-3V8" />
      <path d="M9 15c0 1.66 2.69 3 6 3s6-1.34 6-3v-4" />
      <ellipse cx="15" cy="11" rx="6" ry="3" />
    </svg>
  );
}

/** "Redusert forbruk" / "Miljøvennlig løsning" / etikk-og-ansvar "Miljø". */
export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14z" />
      <path d="M5 19c0-5 3-8 8-10" />
    </svg>
  );
}

/** "Rent arbeidsmiljø" (industri). */
export function SparkleIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
      <path d="M19 15l.7 1.9L21.5 17.5l-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.6z" />
    </svg>
  );
}

/** etikk-og-ansvar "Etiske retningslinjer". */
export function ScalesIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M12 3v18" />
      <path d="M7 7h10" />
      <path d="M7 7l-3 6a3 3 0 006 0zM17 7l-3 6a3 3 0 006 0z" />
      <path d="M9 21h6" />
    </svg>
  );
}

/** etikk-og-ansvar "Varsling". */
export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M3 10v4a1 1 0 001 1h2l7 4V5L6 9H4a1 1 0 00-1 1z" />
      <path d="M13 9a3 3 0 010 6" />
    </svg>
  );
}

/** etikk-og-ansvar "Leverandørkrav". */
export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M2 12l4-4 4 3 2-2 2 2-3 3-3-2-3 3z" />
      <path d="M11 11l3-3 4 4-3 3" />
      <path d="M8 14l2 2M11 12l2.5 2.5" />
    </svg>
  );
}
