import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/artikler/ArticleCard";
import { ContactCta } from "@/components/ContactCta";
import { pageMetadata } from "@/lib/seo";
import { artikler } from "@/lib/artikler";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/artikler",
});

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
            {artikler.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                href={`/artikler/${article.id}`}
                image={article.cardImage}
              />
            ))}
          </div>
        </div>
      </Container>
      <ContactCta />
    </main>
  );
}
