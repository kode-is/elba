import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { ServicesMenu } from "./ServicesMenu";
import { nav, navCta } from "@/lib/site";

// docs/scrape/home.json's header block (role: "logo") — same file as the
// footer logo (docs/handover.md "Logos").
const LOGO = { src: "/images/home/00-d1c05434.png", width: 216, height: 64 };

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between py-6 md:py-8">
        <Link href="/" aria-label="ELBA - Hjem">
          <Image
            src={LOGO.src}
            alt="ELBA"
            width={LOGO.width}
            height={LOGO.height}
            className="h-8 w-auto md:h-10"
            priority
          />
        </Link>

        {/* Nav + CTA are grouped so the hover panel can anchor (right-0)
            to this group's right edge — i.e. the "Kontakt oss" button's
            right edge — instead of centring under the "Tjenester" word.
            Desktop nav starts at lg, not md: with "Produkter" as a fifth
            item the row needs ~735px, more than a 768px viewport's 668px
            band, so tablets keep the hamburger menu. */}
        <div className="relative ml-auto hidden items-center gap-x-10 lg:flex">
          <nav aria-label="Hovedmeny" className="flex items-center gap-x-[30px]">
            {nav.map((item) =>
              item.text === "Tjenester" ? (
                <ServicesMenu key={item.href} href={item.href} text={item.text} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-body-lg font-normal text-white transition hover:text-white/80"
                >
                  {item.text}
                </Link>
              ),
            )}
          </nav>

          <Link
            href={navCta.href}
            className="inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
          >
            {navCta.text}
          </Link>
        </div>

        <MobileMenu nav={nav.map((item) => ({ text: item.text, href: item.href }))} />
      </Container>
    </header>
  );
}
