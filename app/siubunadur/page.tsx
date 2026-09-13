import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { IntroSection } from "@/components/siubunadur/IntroSection";
import { SuitabilitySection } from "@/components/siubunadur/SuitabilitySection";
import { ProductsSection } from "@/components/siubunadur/ProductsSection";

// docs/scrape/siubunadur.json — same <title>/<meta description> as every
// other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/siubunadur",
});

// docs/scrape/siubunadur.json block 1. Scraped at a 512x238 thumbnail; the
// actual downloaded file is 1752x815 (same ~2.15:1 aspect), so that's what
// is passed to next/image to avoid the small-thumbnail distortion noted on
// the /thjonusta hero (see components/smurkerfi's HERO_IMAGE comment).
const HERO_IMAGE = { src: "/images/home/21-212e4fb5.png", alt: "", width: 1752, height: 815 };

const WindIcon = CATEGORY_ICONS.siubunadur;

export default function SiubunadurPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Síubúnaður"
        subtitle="Lofthreinsitæki frá BMair - bylting í heilbrigðu vinnuumhverfi"
        icon={WindIcon ? <WindIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Síubúnaður" }]} />
        </Container>
      </div>
      <IntroSection />
      <SuitabilitySection />
      <ProductsSection />
      <ContactCta />
    </main>
  );
}
