import Image from "next/image";
import { site } from "@/lib/site";

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
// HouseIcon/PhoneIcon/MailIcon for the same reasoning) — plain glyphs in the
// same stroke style, sized for the hero pills' small red badges.
function MailIcon() {
  return (
    <svg {...ICON_PROPS} className="h-4 w-4 text-white">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9l5 4 5-4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...ICON_PROPS} className="h-4 w-4 text-white">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

// docs/scrape/home.json blocks 0-8: logo (rendered by Header), the hero
// video + its poster still, the "Velkommen\ntil ELBA" H1, the tagline and
// the email/phone pills. The live anchors for the pills have no href —
// controller ruling: render them as real mailto:/tel: links, text verbatim.
export function Hero() {
  return (
    <div className="relative flex h-[560px] items-end overflow-hidden pb-16 md:h-[640px] md:pb-24">
      {/* docs/scrape/home.json block 2: the hero still, scraped as its own
          content image (not just a <video poster>). Rendered as a real
          <img> sitting behind the video — the reduced-motion fallback that
          app/globals.css's `.hero-video { display: none }` rule needs
          (without this the video's own `poster` attribute would disappear
          along with the hidden <video> element), and it's also what keeps
          npm run verify's local/live visible-image count in parity. */}
      <Image
        src="/images/home/01-a13ec070.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <video
        className="hero-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/home/01-a13ec070.png"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-site px-5 md:px-[50px]">
        <h1 className="text-[44px] font-semibold leading-[1.05] text-white md:text-[70px] md:leading-[1.02]">
          Velkommen
          <br />
          til ELBA
        </h1>
        <p className="mt-4 text-base text-white/90 md:text-lg">I Industriens tjeneste</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-3 rounded-full bg-black/40 py-2 pl-2 pr-5 backdrop-blur-sm transition hover:bg-black/50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand">
              <MailIcon />
            </span>
            <h4 className="text-sm font-semibold text-white">{site.email}</h4>
          </a>
          <a
            href={site.phoneHref}
            className="flex items-center gap-3 rounded-full bg-black/40 py-2 pl-2 pr-5 backdrop-blur-sm transition hover:bg-black/50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand">
              <PhoneIcon />
            </span>
            <h4 className="text-sm font-semibold text-white">{site.phone}</h4>
          </a>
        </div>
      </div>
    </div>
  );
}
