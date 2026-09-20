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
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-section font-semibold text-black md:text-section-lg">Nyeste artikler</h2>
            <p className="mt-4 max-w-sm text-lead text-ink-muted md:text-lead-lg">
              Hold deg oppdatert med våre siste nyheter, tips og oppdateringer fra bransjen.
            </p>
            <Link
              href="/artikler"
              className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
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
