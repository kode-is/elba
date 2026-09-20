import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { CurrentYear } from "./CurrentYear";
import { site, footerColumns } from "@/lib/site";

type FooterColumn = (typeof footerColumns)[number];

// docs/scrape/home.json's footer block (role: "logo") — same file as the
// header logo (docs/handover.md "Logos").
const LOGO = { src: "/images/home/00-d1c05434.png", width: 216, height: 64 };

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// docs/scrape/svg/f9706e44.svg — the exact house/address icon path captured
// from the live footer (its inline-svg.json "nearbyText" sits right next to
// the address/phone text on /kontakt-oss).
function HouseIcon({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M3 9.5L12 4l9 5.5M19 13v6.4a.6.6 0 01-.6.6H5.6a.6.6 0 01-.6-.6V13" />
    </svg>
  );
}

// Not captured standalone in docs/scrape/svg/ — a plain phone-handset glyph
// in the same stroke style as the scraped house icon above.
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

// Not captured standalone in docs/scrape/svg/ — a plain envelope glyph in
// the same stroke style as the scraped house icon above.
function MailIcon({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9l5 4 5-4" />
    </svg>
  );
}

function FooterLinkColumn({ column, className }: { column: FooterColumn; className?: string }) {
  return (
    <div className={className}>
      <h4 className="mb-6 font-ui text-label-lg font-semibold text-black">{column.heading}</h4>
      <ul className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:items-start md:justify-between">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-ui text-body-lg text-ink-muted transition hover:text-brand"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [selskapet] = footerColumns;

  return (
    <footer className="bg-surface py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-center gap-12 text-center md:grid md:grid-cols-[1fr_1.4fr] md:items-start md:gap-0 md:text-left">
          <div className="order-1 flex flex-col items-center gap-4 md:items-start">
            <Link href="/" aria-label="ELBA - Hjem">
              <Image src={LOGO.src} alt="ELBA" width={LOGO.width} height={LOGO.height} className="h-14 w-auto" />
            </Link>
            <div className="text-[18px] leading-[2] text-ink-muted">
              <p className="flex items-center gap-2">
                <HouseIcon className="h-[18px] w-[18px] shrink-0" />
                <span>{site.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
                <a href={site.phoneHref} className="transition hover:text-brand">
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MailIcon className="h-[18px] w-[18px] shrink-0" />
                <a href={`mailto:${site.email}`} className="transition hover:text-brand">
                  {site.email}
                </a>
              </p>
            </div>
            <div className="mt-4 text-body text-ink-faint">
              <p>Org.nr. {site.orgNumber}</p>
              <p>
                © <CurrentYear /> {site.copyright}
              </p>
            </div>
          </div>

          <FooterLinkColumn column={selskapet} className="order-2" />
        </div>
      </Container>
    </footer>
  );
}
