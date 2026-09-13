import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { ChildCards, type ChildCard } from "@/components/hifi/ChildCards";
import { HifiSections } from "@/components/hifi/HifiSections";
import { pageMetadata } from "@/lib/seo";
import { hifiPages, type HifiPage } from "@/lib/hifi";

// Site-wide <title>/<meta description> pattern: every hífi- og festibúnaður
// route (docs/scrape/hifi-festibunadur*.json) shares the one <title>, with
// each page's own scraped description.
const PAGE_TITLE = "Skralli - Þinn samstarfsaðili";

const HifiIcon = CATEGORY_ICONS["hifi-festibunadur"];

type PageParams = { slug: string[] };

function findPage(slug: string[]): HifiPage | undefined {
  const path = slug.join("/");
  return hifiPages.find((p) => p.path.join("/") === path);
}

/** stroffur's three child cards: its `blocks` alternate [link, heading]
 * pairs (the scrape's own card order), zipped with `images` in the same
 * order — see scripts/gen-hifi.mjs's parsing-rules comment. */
function buildChildCards(page: HifiPage): ChildCard[] {
  const cards: ChildCard[] = [];
  let imageIndex = 0;
  for (let i = 0; i < page.blocks.length; i++) {
    const block = page.blocks[i];
    const next = page.blocks[i + 1];
    if (block.type === "link" && next?.type === "heading") {
      const image = page.images[imageIndex++];
      if (image) cards.push({ href: block.href, title: next.text, image });
    }
  }
  return cards;
}

export function generateStaticParams() {
  return hifiPages.map((page) => ({ slug: page.path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  return pageMetadata({
    title: PAGE_TITLE,
    description: page.description,
    path: `/hifi-festibunadur/${page.path.join("/")}`,
  });
}

export default async function HifiSlugPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();

  const breadcrumbItems: BreadcrumbItem[] = [{ text: "Hífi- og festibúnaður", href: "/hifi-festibunadur" }];
  if (page.path.length === 2) {
    breadcrumbItems.push({ text: "Stroffur", href: "/hifi-festibunadur/stroffur" });
  }
  breadcrumbItems.push({ text: page.title });

  return (
    <main id="main">
      <PageHero
        image={page.heroImage!}
        title={page.title}
        subtitle={page.subtitle}
        icon={HifiIcon ? <HifiIcon className="h-6 w-6" /> : undefined}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>
      <section className="bg-white py-10 md:py-14">
        <Container>
          {page.children ? (
            <ChildCards items={buildChildCards(page)} />
          ) : (
            <HifiSections blocks={page.blocks} images={page.images} tables={page.tables} />
          )}
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
