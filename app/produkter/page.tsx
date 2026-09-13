import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ProductLinkList } from "@/components/produkter/ProductLinkList";
import { ContactCta } from "@/components/ContactCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA AS - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/produkter",
});

// docs/scrape/produkter.json blocks 10-16 — no icons: docs/reference/
// produkter.desktop.jpg shows plain white pills, and docs/scrape/
// inline-svg.json has no per-item icon set for /produkter (see
// docs/handover.md).
const DELIVERABLES = [
  "Standardvarer",
  "Spesialdeler",
  "OEM-løsninger",
  "Ettermarked",
  "Teknisk rådgivning",
  "Dokumentasjon",
  "Overvåking",
];

// docs/scrape/produkter.json blocks 17-49, in scrape order. Two hrefs/texts
// carry a leading U+200B on live (Skottgjennomføring, Lynfittings) — not
// visible copy, stripped here (see docs/handover.md).
const PRODUCTS = [
  { text: "Fett", href: "/produkter/fett", image: { src: "/images/produkter/03-e1cf3aba.jpeg", alt: "", width: 303, height: 404 } },
  { text: "Skruhylser", href: "/produkter/skruhylser", image: { src: "/images/produkter/04-b584c29f.jpg", alt: "", width: 400, height: 260 } },
  { text: "Forlengere", href: "/produkter/forlengere", image: { src: "/images/produkter/05-a9bab172.jpg", alt: "", width: 400, height: 266 } },
  { text: "Skottgjennomføring", href: "/produkter/skottgjennomføring", image: { src: "/images/produkter/06-53f273f5.jpg", alt: "", width: 400, height: 260 } },
  { text: "Slanger", href: "/produkter/slanger", image: { src: "/images/produkter/07-9bd24da2.jpg", alt: "", width: 303, height: 91 } },
  { text: "Rørender", href: "/produkter/rørender", image: { src: "/images/produkter/08-3adcc4e8.jpg", alt: "", width: 400, height: 265 } },
  { text: "Fylleutstyr", href: "/produkter/fylleutstyr", image: { src: "/images/produkter/09-d1bc0ce1.jpeg", alt: "", width: 303, height: 303 } },
  { text: "Banjokoblinger", href: "/produkter/banjokoblinger", image: { src: "/images/produkter/10-948804a8.jpg", alt: "", width: 303, height: 196 } },
  { text: "Snittringmatur", href: "/produkter/snittringmatur", image: { src: "/images/produkter/11-575445e6.jpg", alt: "", width: 400, height: 257 } },
  { text: "Lynfittings", href: "/produkter/lynfittings", image: { src: "/images/produkter/12-f7bc3daa.jpg", alt: "", width: 400, height: 261 } },
  { text: "Fyllenippler", href: "/produkter/fyllenippler", image: { src: "/images/produkter/13-a8093807.jpg", alt: "", width: 400, height: 261 } },
];

export default function Produkter() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/home/05-92660531.jpeg",
          alt: "Snjókeðjur, Hlífi- & festibúnaður",
          width: 1919,
          height: 2560,
        }}
        title="Produkter"
        subtitle="Alt du trenger til installasjon, vedlikehold og drift"
      />
      <Container narrow>
        <div className="py-12 md:py-16">
          <Breadcrumb items={[{ text: "Produkter" }]} />

          <div className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-[23px] leading-[1.3] font-semibold text-black md:text-[36px]">Et bredt produktspekter</h3>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                I tillegg til det vi normalt har på lager og vårt faste sortiment, kan vi skaffe det meste som
                trengs relatert til smøring, montering og drift: slanger, fittings, ventiler, fordelere, pumper,
                styring/overvåking og tilhørende komponenter. Ta kontakt dersom du har behov for en spesifikk del
                eller ønsker teknisk bistand.
              </p>
              <Link
                href="/kontakt-oss"
                className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
              >
                Kontakt oss
              </Link>
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/produkter/02-620c9f4c.jpeg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      <section className="bg-surface py-14 md:py-20">
        <Container narrow>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Vi leverer</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {DELIVERABLES.map((item) => (
              <div key={item} className="rounded-full bg-white px-6 py-4">
                <h3 className="font-ui text-[20px] leading-[1.4] font-semibold text-black">{item}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-12 md:py-16">
          <ProductLinkList items={PRODUCTS} />
        </div>
      </Container>

      <ContactCta />
    </main>
  );
}
