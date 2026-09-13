import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { site, footerColumns } from "@/lib/site";

type FooterColumn = (typeof footerColumns)[number];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M15 8.5h2V5.5h-2c-2.21 0-4 1.79-4 4v2H9v3h2v6.5h3V14.5h2.2l.8-3H14v-2c0-.55.45-1 1-1Z"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth={1.3} />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth={1.3} />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

function FooterLinkColumn({ column, className }: { column: FooterColumn; className?: string }) {
  return (
    <div className={className}>
      <h4 className="mb-4 font-ui font-semibold text-neutral-900">{column.heading}</h4>
      <ul className="space-y-3">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-ui text-sm text-neutral-600 transition hover:text-brand-dark"
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
  const [fyrirtaekid, vorumerki, thjonusta] = footerColumns;

  return (
    <footer className="bg-white py-16 md:py-20">
      <Container>
        {/* Mobile shows only the "Fyrirtækið" column above the company
            block; "Vörumerki" and "Þjónusta" are desktop-only. On desktop
            all four blocks sit left-to-right: company, then the three
            columns. See docs/reference/home.desktop.jpg and
            docs/reference/home.mobile.jpg. */}
        <div className="flex flex-col items-center gap-12 text-center md:grid md:grid-cols-[1.3fr_1fr_1fr_1fr] md:items-start md:gap-8 md:text-left">
          <div className="order-2 flex flex-col items-center gap-4 md:order-1 md:items-start">
            <Link href="/" aria-label="Skralli - Forsíða">
              <Image
                src="/logos/skralli-blue-on-white.png"
                alt="Skralli"
                width={537}
                height={146}
                className="h-10 w-auto"
              />
            </Link>
            <p className="font-ui text-neutral-900">{site.motto}</p>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>{site.address}</p>
              <p>{site.kennitala}</p>
              <p>{site.phoneLabel}</p>
              <p>{site.email}</p>
              <p>{site.hours}</p>
            </div>
            <div className="flex items-center gap-4 text-neutral-900">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Skralli á Facebook"
                className="transition hover:text-brand-dark"
              >
                <FacebookIcon />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Skralli á Instagram"
                className="transition hover:text-brand-dark"
              >
                <InstagramIcon />
              </a>
            </div>
            <Image
              src="/images/home/34-5f7b6ec9.jpg"
              alt="Fyrirmyndarfyrirtæki í rekstri 2025 — Viðskiptablaðið / Keldan"
              width={151}
              height={106}
              className="mt-2"
            />
          </div>

          <FooterLinkColumn column={fyrirtaekid} className="order-1 md:order-2" />
          <FooterLinkColumn column={vorumerki} className="hidden md:order-3 md:block" />
          <FooterLinkColumn column={thjonusta} className="hidden md:order-4 md:block" />
        </div>
      </Container>
    </footer>
  );
}
