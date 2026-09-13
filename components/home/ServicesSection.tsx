import Link from "next/link";
import { Container } from "@/components/Container";
import { FeatureCard } from "@/components/FeatureCard";

// docs/scrape/home.json blocks 50-61.
const SERVICES = [
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
] as const;

export function ServicesSection() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">Våre tjenester</h2>
          <Link
            href="/tjenester"
            className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Se utvalget
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-600 md:text-right md:text-base">
          Gi oss utfordringen så skal vi se hva vi klarer
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Link key={service.href} href={service.href} className="block">
              <FeatureCard heading={service.heading} text={service.text} image={service.image} />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
