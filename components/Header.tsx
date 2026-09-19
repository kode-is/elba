import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { ServicesMenu } from "./ServicesMenu";
import { SearchPalette } from "./SearchPalette";
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

        {/* Nav, search and CTA are grouped so the Tjenester hover panel can
            anchor (right-0) to this group's right edge — i.e. the "Kontakt
            oss" button's right edge — instead of centring under the
            "Tjenester" word. Desktop nav starts at lg, not md: with
            "Produkter" as a fifth item the row needs more than a 768px
            viewport's 668px band, so tablets keep the hamburger menu. The
            search button shows at every width; below lg it sits beside the
            hamburger. */}
        <div className="relative ml-auto flex items-center gap-x-1 lg:gap-x-8">
          <nav aria-label="Hovedmeny" className="hidden items-center gap-x-[30px] lg:flex">
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

          <SearchPalette />

          <Link
            href={navCta.href}
            className="hidden items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50 lg:inline-flex"
          >
            {navCta.text}
          </Link>

          <MobileMenu nav={nav.map((item) => ({ text: item.text, href: item.href }))} />
        </div>
      </Container>
    </header>
  );
}
