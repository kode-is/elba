import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { brands } from "@/lib/brands";

type BrandPageParams = { slug: string };

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BrandPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((item) => item.id === slug);
  if (!brand) return {};
  return pageMetadata({ title: brand.title, description: brand.description, path: brand.href });
}

export default async function BrandPage({
  params,
}: {
  params: Promise<BrandPageParams>;
}) {
  const { slug } = await params;
  const brand = brands.find((item) => item.id === slug);
  if (!brand) notFound();

  return (
    <main id="main">
      {/* Title band: the page's single content image as a full-bleed
          background, matching the reference screenshots — PageHero's
          default height is 420/560px; these bands measure 438/479px. */}
      <PageHero image={brand.image} title={brand.name} height="h-[438px] md:h-[479px]" />
      {/* Every reference screenshot shows a large, near-constant gap of
          ~140px (mobile) / ~210px (desktop) between the last paragraph and
          the ContactCta band, regardless of how much copy a brand has (it's
          just as large on Gigant's 2 paragraphs as on Lilleseth's 5) — so
          this is a fixed section padding-bottom, not content-driven. */}
      <section className="bg-white pt-16 pb-36 md:pb-40">
        <Container>
          <Breadcrumb
            items={[{ text: "Vörumerki", href: "/vorumerki" }, { text: brand.name }]}
          />
          <div className="mt-10 font-ui text-base leading-relaxed text-neutral-700">
            {brand.subheading ? (
              <h4 className="font-ui text-xl font-semibold text-neutral-900 md:text-2xl">
                {brand.subheading}
              </h4>
            ) : null}
            {brand.body.map((block, index) =>
              block.type === "list" ? (
                <ul key={index} className="mt-4 list-disc space-y-1 pl-5 first:mt-0">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p
                  key={index}
                  className={block.bold ? "mt-8 font-bold first:mt-0" : "mt-8 first:mt-0"}
                >
                  {block.text}
                </p>
              ),
            )}
          </div>
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
