import Link from "next/link";
import { Container } from "@/components/Container";
import { ArticleCard } from "@/components/artikler/ArticleCard";

// docs/scrape/home.json blocks 83-94. Task 10 switches this to
// `artikler.slice(0, 3)` from lib/artikler.ts once that file exists.
const ARTICLES = [
  {
    href: "/artikler/nytt-design",
    title: "Nytt design på Elbas hjemmeside",
    image: { src: "/images/home/06-d6adc654.jpeg", alt: "", width: 220, height: 204 },
  },
  {
    href: "/artikler/nytt-eierskap",
    title: "Nytt eierskap for Elba",
    image: { src: "/images/home/07-85311014.jpeg", alt: "ELBA X SKRALLI", width: 220, height: 186 },
  },
  {
    href: "/artikler/passiv-og-aktiv-overvaaking",
    title: "Passiv og aktiv overvåking for driftsledere",
    image: { src: "/images/home/08-8da04b4f.jpg", alt: "Groenevald-BEKA logo", width: 220, height: 146 },
  },
] as const;

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
            {ARTICLES.map((article) => (
              <ArticleCard key={article.href} title={article.title} href={article.href} image={article.image} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
