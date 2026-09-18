import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ARTIKKEL_SLUGS } from "@/lib/routes";
import { articleBySlug } from "@/lib/artikler";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { ArticleBody } from "@/components/artikler/ArticleBody";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTIKKEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const a = articleBySlug((await params).slug);
  return a ? pageMetadata({ title: a.metaTitle, description: a.metaDescription, path: `/artikler/${a.id}` }) : {};
}

// Body copy (breadcrumb through the last paragraph) sits in a centered
// reading column narrower than the standard Container — measured against
// docs/reference/artikler__nytt-eierskap.desktop.jpg and
// artikler__velge-system.desktop.jpg at 1440px (and confirmed by a live
// probe: the quote paragraphs sit in a 960px column at x=240): both start
// their breadcrumb and body text at x ≈ 241px, i.e. a 960px column centered
// inside the 1240px content band, not at the band's own left edge (x=100).
const READING_COLUMN = "mx-auto max-w-[var(--container-narrow)]";

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();

  return (
    <main id="main">
      <PageHero
        image={a.hero}
        title={a.title}
        height="min-h-[438px] md:min-h-[479px]"
        // "Artikle" is the live site's own breadcrumb copy (verbatim, sic) — not a typo introduced here.
        crumbs={[{ text: "Artikle", href: "/artikler" }, { text: a.title }]}
      />
      <article className="bg-white py-8 md:py-12">
        <Container>
          <div className={READING_COLUMN}>
            {a.subtitle ? (
              <h1 className="mb-6 font-ui text-[24px] leading-[1.2] font-bold text-black md:text-[30px]">
                {a.subtitle}
              </h1>
            ) : null}
            <ArticleBody body={a.body} />
          </div>
        </Container>
      </article>
      <ContactCta />
    </main>
  );
}
