import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import type { Img } from "@/lib/types";

export type ServiceCard = { href: string; heading: string; text: string; image: Img };

// docs/scrape/home.json blocks 50-57 / docs/scrape/tjenester.json blocks
// 4-11 — the same cards, in the same order, on both routes. Live has a third
// card, "Produkter"; products are not a service, so that one is now its own
// nav item and home section instead (approved deviation —
// docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md).
export const SERVICE_CARDS: ServiceCard[] = [
  {
    href: "/anlegg",
    heading: "Anlegg",
    text: "Presis kontinuerlig smøring til din maskin",
    image: { src: "/images/home/03-01289078.jpeg", alt: "", width: 386, height: 515 },
  },
  {
    href: "/industri",
    heading: "Industri",
    text: "Skreddersydde løsninger for norsk industri",
    image: { src: "/images/home/04-41b11055.jpg", alt: "Industri", width: 512, height: 683 },
  },
];

type ServiceCardsGridProps = { className?: string };

/**
 * The whole-card-is-a-link "Anlegg / Industri" grid — shared by the home
 * page's "Våre tjenester" section and /tjenester (which reuses the identical
 * cards with no extra heading around them, per
 * docs/reference/tjenester.desktop.jpg). With two cards instead of live's
 * three, the pair is capped at two of live's card widths (2 x 387px + the
 * 24px gap) and centred, so each card keeps the size it has on live rather
 * than stretching to half the band.
 */
export function ServiceCardsGrid({ className }: ServiceCardsGridProps) {
  return (
    <div className={`mx-auto grid max-w-[798px] gap-6 md:grid-cols-2${className ? ` ${className}` : ""}`}>
      {SERVICE_CARDS.map((service) => (
        <Link key={service.href} href={service.href} className="block">
          <FeatureCard heading={service.heading} text={service.text} image={service.image} headingTag="h5" />
        </Link>
      ))}
    </div>
  );
}
