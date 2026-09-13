import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { brands } from "@/lib/brands";

// docs/scrape/vorumerki.json — same <title>/<meta description> as every
// other route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/vorumerki",
});

// docs/scrape/vorumerki.json card order: BMair, Hammerglass, Groeneveld-BEKA,
// Lilleseth, Gigant, Pebe — different from lib/brands.ts's own order (which
// follows the home page's brand-strip marquee instead).
const INDEX_ORDER = ["bmair", "hammerglass", "um-beka", "lilleseth-kjetting", "gigant", "pebe"];
const orderedBrands = INDEX_ORDER.map((id) => brands.find((brand) => brand.id === id)).filter(
  (brand): brand is (typeof brands)[number] => Boolean(brand),
);

export default function VorumerkiPage() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/vorumerki/01-a24654d1.jpg",
          alt: "Ísjakar á lygnu vatni í rökkri",
          width: 1440,
          height: 960,
        }}
        title="Vörumerki"
      />
      <section className="bg-white py-16 md:py-20">
        <Container>
          <Breadcrumb items={[{ text: "Vörumerki" }]} />
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {orderedBrands.map((brand) => {
              const image = brand.cardImage;
              return (
                <div key={brand.id} className="flex flex-col">
                  <div className="flex h-44 items-center justify-center">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt || brand.name}
                        width={image.width}
                        height={image.height}
                        className="h-full w-auto max-w-[80%] object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#f0f4fa] p-6">
                    <h3 className="font-ui text-lg font-semibold text-neutral-900">{brand.name}</h3>
                    <Link
                      href={brand.href}
                      className="mt-2 inline-flex items-center text-sm font-semibold text-brand-dark transition hover:underline"
                    >
                      Skoða nánar →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
