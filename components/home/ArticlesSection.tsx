import Link from "next/link";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/artikler/ArticleCard";
import { artikler } from "@/lib/artikler";

// docs/scrape/home.json blocks 83-94: the first three articles in
// lib/artikler.ts's index order (nytt-design, nytt-eierskap,
// passiv-og-aktiv-overvaaking).
const HOME_ARTICLES = artikler.slice(0, 3);

export function ArticlesSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">Nyeste artikler</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600 md:text-base">
              Hold deg oppdatert med våre siste nyheter, tips og oppdateringer fra bransjen.
            </p>
            <Link
              href="/artikler"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Les mer
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {HOME_ARTICLES.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                href={`/artikler/${article.id}`}
                image={article.cardImage}
                variant="row"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
