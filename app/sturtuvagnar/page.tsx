import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { IntroSection } from "@/components/sturtuvagnar/IntroSection";
import { FeaturesSection } from "@/components/sturtuvagnar/FeaturesSection";
import { OtherGroupsSection } from "@/components/sturtuvagnar/OtherGroupsSection";

// docs/scrape/sturtuvagnar.json — same <title>/<meta description> as every
// other route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/sturtuvagnar",
});

// docs/scrape/sturtuvagnar.json block 1: same photo as the home page's
// "Sturtuvagnar" category card (lib/categories.ts), used full-bleed as the
// hero background here. Scraped at a 512x341 thumbnail size; the actual
// downloaded file is 6000x4000 (same ~1.5 aspect), so that's what we pass to
// next/image to avoid the small-thumbnail distortion noted on /thjonusta and
// /smurkerfi.
const HERO_IMAGE = {
  src: "/images/home/23-16722dae.jpeg",
  alt: "Traktor að losa svartan Gigant sturtuvagn í snjó",
  width: 6000,
  height: 4000,
};

const CubeIcon = CATEGORY_ICONS.sturtuvagnar;

export default function SturtuvagnarPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Sturtuvagnar"
        subtitle="Slitsterkir sturtuvagnar framleiddir í Noregi og með 5 ára ábyrgð"
        icon={CubeIcon ? <CubeIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Sturtuvagnar" }]} />
        </Container>
      </div>
      <IntroSection />
      <FeaturesSection />
      <OtherGroupsSection />
      <ContactCta />
    </main>
  );
}
