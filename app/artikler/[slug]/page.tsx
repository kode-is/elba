import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ARTIKKEL_SLUGS } from "@/lib/routes";
import { articleBySlug } from "@/lib/artikler";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
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
// artikler__velge-system.desktop.jpg at 1440px: both start their breadcrumb
// and body text at the same x ≈ 241px, i.e. a ~960px column centered inside
// the 1340px site container, not the container's own left edge (x ≈ 50px).
const READING_COLUMN = "mx-auto max-w-[960px]";

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();

  return (
    <main id="main">
      <PageHero image={a.hero} title={a.title} height="min-h-[438px] md:min-h-[479px]" />
      <div className="bg-white pt-6">
        <Container>
          <div className={READING_COLUMN}>
            {/* "Artikle" is the live site's own breadcrumb copy (verbatim, sic) — not a typo introduced here. */}
            <Breadcrumb items={[{ text: "Artikle", href: "/artikler" }, { text: a.title }]} />
          </div>
        </Container>
      </div>
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
