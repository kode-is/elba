import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/lib/categories";

// docs/scrape/thjonusta.json — same <title>/<meta description> as every
// other route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/thjonusta",
});

// docs/scrape/thjonusta.json block 1: the scraper recorded this hero image
// at a 512x341 thumbnail size, far smaller than every other full-bleed hero
// on the site (home/404/um-okkur are all captured at the 1440-wide viewport
// size); the reference screenshot confirms it's the same full-width
// photographic hero, so we request it at the native file's ~3:2 aspect
// instead of the scraped box size.
const HERO_IMAGE = {
  src: "/images/thjonusta/01-d13aa3c1.jpg",
  alt: "Reykjavík og snævi þakin fjöll í rökkri",
  width: 1440,
  height: 960,
};

export default function ThjonustaPage() {
  return (
    <main id="main">
      <PageHero image={HERO_IMAGE} title="Þjónustur" />
      <section className="bg-[#f0f4fa] py-16 md:py-20">
        <Container>
          <Breadcrumb items={[{ text: "Þjónustur" }]} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
