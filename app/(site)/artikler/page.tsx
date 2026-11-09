import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/artikler/ArticleCard";
import { ContactCta } from "@/components/ContactCta";
import { pageMetadata } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-meta";
import { artikler } from "@/lib/artikler";

export const metadata = pageMetadata(PAGE_META["/artikler"]);

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
        crumbs={[{ text: "Artikler" }]}
      />
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-3">
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
