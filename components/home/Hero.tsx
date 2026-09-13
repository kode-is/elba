import Image from "next/image";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth={1.5} />
      <path d="m4 6.5 8 6 8-6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M6.5 4.5c.6 0 1.1.4 1.3.9l1 2.6c.2.5 0 1.1-.4 1.5l-1.2 1.1c1 2.1 2.7 3.8 4.8 4.8l1.1-1.2c.4-.4 1-.5 1.5-.4l2.6 1c.5.2.9.7.9 1.3v2.1c0 1-.8 1.7-1.7 1.6-6-.6-10.8-5.4-11.4-11.4C4.9 7.3 5.6 4.5 6.5 4.5Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    // `flex flex-col justify-end` anchors the text block to the bottom of the
    // tall background image (docs/reference/home.desktop.jpg), matching the
    // live site. Container needs an explicit `w-full` here: as a flex item
    // its own `mx-auto` margins would otherwise win the cross-axis alignment
    // (CSS gives auto margins priority over stretch), shrinking it to its
    // content's width and centering that narrow box instead of filling the
    // section so the text lands at the standard left margin.
    <section className="relative isolate flex min-h-[600px] flex-col justify-end overflow-hidden pb-16 pt-32 md:min-h-[760px] md:pb-24 md:pt-40">
      <Image
        src="/images/home/01-087a3e5c.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Live site plays a looping background video behind the hero title
          (https://framerusercontent.com/assets/Zuc7sp49I7PBk72pIJRKgtj2qw.mp4,
          downloaded to public/video/hero.mp4). The still image above stays as
          the poster/fallback layer underneath until the video starts playing,
          and for prefers-reduced-motion visitors (hidden via globals.css). */}
      <video
        className="hero-video absolute inset-0 -z-10 h-full w-full object-cover"
        src="/video/hero.mp4"
        poster="/images/home/01-087a3e5c.png"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-black/15 to-black/40" aria-hidden="true" />

      <Container className="w-full">
        <h1 className="max-w-xl whitespace-pre-line text-4xl font-semibold leading-[1.1] text-white md:text-6xl">
          {"Þinn\nsamstarfsaðili"}
        </h1>
        <p className="mt-4 max-w-sm text-sm text-white/90 md:text-base">
          Sölu- og þjónustuaðili fyrir vinnuvélar, landbúnað og stóriðju
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-3 rounded-full bg-white/20 py-1.5 pl-1.5 pr-5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark">
              <MailIcon />
            </span>
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-3 rounded-full bg-white/20 py-1.5 pl-1.5 pr-5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark">
              <PhoneIcon />
            </span>
            {site.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
