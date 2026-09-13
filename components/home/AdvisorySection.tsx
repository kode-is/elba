const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Not captured standalone in docs/scrape/svg/ (see components/Footer.tsx's
// icon comments for the same reasoning) — plain calendar/clock glyphs for
// the "Høy tilgjengelighet" / "Rask responstid" key points' red badges
// (docs/reference/home.desktop.jpg).
function CalendarIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5 text-white">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M12 14v3M10.5 15.5h3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5 text-white">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

// docs/scrape/home.json blocks 62-67: heading + paragraph, then two key
// points whose H2 is split across a heading ("Høy" / "Rask") and a
// following text block ("tilgjengelighet" / "responstid") — rendered
// together as the reference screenshot shows.
export function AdvisorySection() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">Faglig rådgivning</h2>
      <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base">
        I over 30 år har ELBA bygget opp in-house ekspertise på smøresystemer og relaterte løsninger. Ta kontakt i
        dag så finner vi den løsningen som sparer din drift for mest tid og ressurser.
      </p>

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand">
            <CalendarIcon />
          </span>
          <div>
            <h2 className="font-ui text-lg font-semibold text-neutral-900">Høy</h2>
            <p className="text-sm text-neutral-600">tilgjengelighet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand">
            <ClockIcon />
          </span>
          <div>
            <h2 className="font-ui text-lg font-semibold text-neutral-900">Rask</h2>
            <p className="text-sm text-neutral-600">responstid</p>
          </div>
        </div>
      </div>
    </div>
  );
}
