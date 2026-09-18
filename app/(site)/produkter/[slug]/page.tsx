import { notFound, permanentRedirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PRODUKT_SLUGS } from "@/lib/routes";
import { productBySlug } from "@/lib/produkter";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { SubnavLabels } from "@/components/produkter/SubnavLabels";
import { ProductTables } from "@/components/produkter/ProductTables";
import { CatalogSearchForm } from "@/components/produkter/CatalogSearchForm";

type Params = { slug: string };
const clean = (raw: string) => {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export function generateStaticParams(): Params[] {
  return PRODUKT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const p = productBySlug(clean((await params).slug).replace(/^​/, ""));
  return p ? pageMetadata({ title: p.metaTitle, description: p.metaDescription, path: `/produkter/${p.id}` }) : {};
}

// Two live product URLs carry a leading U+200B (zero-width space) — see
// lib/routes.ts / scripts/routes.mjs's LIVE_PATH_OVERRIDES. This rebuild
// serves the clean slug and redirects the U+200B form here.
export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const raw = clean((await params).slug);
  if (raw.startsWith("​")) permanentRedirect(`/produkter/${encodeURIComponent(raw.slice(1))}`);
  const p = productBySlug(raw);
  if (!p) notFound();

  return (
    <main id="main">
      <PageHero
        image={p.hero}
        title={p.title}
        height="min-h-[438px] md:min-h-[479px]"
        crumbs={[{ text: "Produkter", href: "/produkter" }, { text: p.title }]}
      />
      <section className="bg-white py-12 md:py-16">
        <Container>
          <CatalogSearchForm id="produkt-sok" className="mb-10 max-w-xl" />
          <SubnavLabels items={p.subnav} />
          {p.intro.map((t) => (
            <p key={t} className="mb-4 font-ui text-body-lg text-ink-muted">
              {t}
            </p>
          ))}
          <ProductTables tables={p.tables} />
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
