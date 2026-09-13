import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { TrailerIcon } from "@/components/sturtuvagnar/TrailerIcon";
import { WagonSections } from "@/components/sturtuvagnar/WagonSections";
import { FactStrip } from "@/components/sturtuvagnar/FactStrip";
import { ProductIntro } from "@/components/sturtuvagnar/ProductIntro";
import { InquiryProvider } from "@/components/sturtuvagnar/InquiryContext";
import { MobileQuoteBar } from "@/components/sturtuvagnar/MobileQuoteBar";
import { ProductFeatureTiles } from "@/components/sturtuvagnar/ProductFeatureTiles";
import { SiblingProducts } from "@/components/sturtuvagnar/SiblingProducts";
import { pageMetadata } from "@/lib/seo";
import { wagonGroups, wagons, groupFeatures, type WagonGroup, type Wagon } from "@/lib/sturtuvagnar";

type PageParams = { slug: string };

function findRecord(slug: string): WagonGroup | Wagon | undefined {
  return wagonGroups.find((group) => group.slug === slug) ?? wagons.find((wagon) => wagon.slug === slug);
}

// Wagon is the only one of the two record shapes with a `groupId`, so this
// also distinguishes a wagon-group page from a product page — used only to
// decide whether to show the group hero's TrailerIcon badge
// (docs/reference/sturtuvagnar__hjolagrofuvagnar.desktop.jpg and the other
// four group screenshots all have it; every product screenshot doesn't).
function isGroup(record: WagonGroup | Wagon): record is WagonGroup {
  return !("groupId" in record);
}

export function generateStaticParams() {
  return [...wagonGroups, ...wagons].map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = findRecord(slug);
  if (!record) return {};
  return pageMetadata({
    title: record.pageTitle,
    description: record.description,
    path: `/sturtuvagnar/${record.slug}`,
  });
}

export default async function SturtuvagnarSlugPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const record = findRecord(slug);
  if (!record) notFound();

  if (isGroup(record)) {
    return (
      <main id="main">
        <PageHero
          image={record.heroImage}
          title={record.title}
          icon={<TrailerIcon className="h-6 w-6" />}
          breadcrumb={
            <Breadcrumb
              variant="hero"
              items={[{ text: "Sturtuvagnar", href: "/sturtuvagnar" }, { text: record.title }]}
            />
          }
        />
        <section className="bg-white py-10 md:py-14">
          <Container>
            <WagonSections blocks={record.blocks} images={record.images} />
          </Container>
        </section>
        <ContactCta />
      </main>
    );
  }

  // `record` is a product (Wagon) from here — mockup 1 (design/Main.tpl.html)
  // fills these in with content already carried by lib/sturtuvagnar.ts
  // (see scripts/gen-sturtuvagnar.mjs): the product's own blurb, its
  // group's "Um X" paragraphs, sibling products, and (hjólagröfuvagnar
  // only) the shared feature tiles.
  const group = wagonGroups.find((candidate) => candidate.id === record.groupId);
  if (!group) notFound();

  // Mockup's hero subtitle is the first sentence of the blurb (e.g. "Fyrir
  // allt frá 10 tonna gröfum") — text up to the first period, generically,
  // not a hardcoded per-product string.
  const heroSubtitle = record.blurb.split(".")[0].trim();

  // SiblingProducts (design.dc.html 1a/1e "Tegundir í boði") renders the
  // WHOLE group, current product included, in the group's own card order.
  const groupProducts = group.products
    .map((productSlug) => wagons.find((w) => w.slug === productSlug))
    .filter((w): w is Wagon => Boolean(w));

  const features = groupFeatures[group.id];

  return (
    <InquiryProvider>
      <main id="main">
        <PageHero
          image={record.heroImage}
          title={record.title}
          subtitle={heroSubtitle}
          height="h-[400px] md:h-[520px]"
          overlayClassName="bg-gradient-to-b from-[#001A28]/15 via-[#001A28]/45 via-55% to-[#001A28]/[.78]"
          breadcrumb={
            <Breadcrumb
              variant="hero"
              items={[
                { text: "Sturtuvagnar", href: "/sturtuvagnar" },
                { text: group.title, href: `/sturtuvagnar/${group.slug}` },
                { text: record.title },
              ]}
            />
          }
        />
        <FactStrip product={record} group={group} />
        <ProductIntro product={record} group={group} />
        {features ? <ProductFeatureTiles heading={features.heading} items={features.items} /> : null}
        <SiblingProducts group={group} products={groupProducts} currentSlug={record.slug} />
        <ContactCta />
        <MobileQuoteBar product={record} />
      </main>
    </InquiryProvider>
  );
}
