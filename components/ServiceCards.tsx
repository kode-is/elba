import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import type { Img } from "@/lib/types";

export type ServiceCard = { href: string; heading: string; text: string; image: Img };

// docs/scrape/home.json blocks 50-61 / docs/scrape/tjenester.json blocks
// 4-15 — the same three cards, in the same order, on both routes.
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
  {
    href: "/produkter",
    heading: "Produkter",
    text: "Alt du trenger til installasjon, vedlikehold og drift",
    image: {
      src: "/images/home/05-92660531.jpeg",
      alt: "Snjókeðjur, Hlífi- & festibúnaður",
      width: 515,
      height: 687,
    },
  },
];

type ServiceCardsGridProps = { className?: string };

/**
 * The whole-card-is-a-link "Anlegg / Industri / Produkter" grid — shared by
 * the home page's "Våre tjenester" section and /tjenester (which reuses the
 * identical three cards with no extra heading around them, per
 * docs/reference/tjenester.desktop.jpg).
 */
export function ServiceCardsGrid({ className }: ServiceCardsGridProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-3${className ? ` ${className}` : ""}`}>
      {SERVICE_CARDS.map((service) => (
        <Link key={service.href} href={service.href} className="block">
          <FeatureCard heading={service.heading} text={service.text} image={service.image} headingTag="h5" />
        </Link>
      ))}
    </div>
  );
}
