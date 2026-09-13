import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { ServicesMenu } from "./ServicesMenu";
import { nav, navCta } from "@/lib/site";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between py-6 md:py-8">
        <Link href="/" aria-label="ELBA - Hjem">
          <span className="text-2xl font-bold text-brand">ELBA</span>
        </Link>

        {/* Nav + CTA are grouped so the hover panel can anchor (right-0)
            to this group's right edge — i.e. the "Kontakt oss" button's
            right edge — instead of centring under the "Tjenester" word. */}
        <div className="relative ml-auto hidden items-center gap-x-10 md:flex">
          <nav aria-label="Hovedmeny" className="flex items-center gap-x-[30px]">
            {nav.map((item) =>
              item.text === "Tjenester" ? (
                <ServicesMenu key={item.href} href={item.href} text={item.text} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-normal text-white transition hover:text-white/80"
                >
                  {item.text}
                </Link>
              ),
            )}
          </nav>

          <Link
            href={navCta.href}
            className="inline-flex items-center justify-center rounded-md border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand"
          >
            {navCta.text}
          </Link>
        </div>

        <MobileMenu nav={nav.map((item) => ({ text: item.text, href: item.href }))} />
      </Container>
    </header>
  );
}
