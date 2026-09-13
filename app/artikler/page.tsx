import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/artikler/ArticleCard";
import { ContactCta } from "@/components/ContactCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/artikler",
});

// docs/scrape/artikler.json blocks 4-23, in scrape order.
const ARTICLES = [
  {
    href: "/artikler/nytt-design",
    title: "Nytt design på Elbas hjemmeside",
    image: { src: "/images/home/06-d6adc654.jpeg", alt: "", width: 386, height: 358 },
  },
  {
    href: "/artikler/nytt-eierskap",
    title: "Nytt eierskap for Elba",
    image: { src: "/images/home/07-85311014.jpeg", alt: "ELBA X SKRALLI", width: 386, height: 328 },
  },
  {
    href: "/artikler/passiv-og-aktiv-overvaaking",
    title: "Passiv og aktiv overvåking for driftsledere",
    image: { src: "/images/home/08-8da04b4f.jpg", alt: "Groenevald-BEKA logo", width: 386, height: 257 },
  },
  {
    href: "/artikler/hvorfor-smoresystem-industri",
    title: "Hvordan sparer smøresystemer penger?",
    image: { src: "/images/artikler/05-aa3c90a2.png", alt: "Smøresysten", width: 386, height: 290 },
  },
  {
    href: "/artikler/velge-system",
    title: "Å velge riktig type system",
    image: { src: "/images/artikler/06-a2ff5186.jpeg", alt: "", width: 515, height: 687 },
  },
];

export default function Artikler() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/artikler/01-4c5c8102.jpg",
          alt: "Discover",
          width: 1440,
          height: 959,
        }}
        title="Artikler"
      />
      <Container>
        <div className="py-12 md:py-16">
          <Breadcrumb items={[{ text: "Artikler" }]} />
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3">
            {ARTICLES.map((article) => (
              <ArticleCard key={article.href} title={article.title} href={article.href} image={article.image} />
            ))}
          </div>
        </div>
      </Container>
      <ContactCta />
    </main>
  );
}
