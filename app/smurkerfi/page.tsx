import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { IntroSection } from "@/components/smurkerfi/IntroSection";
import { FeaturesSection } from "@/components/smurkerfi/FeaturesSection";
import { FaqSection } from "@/components/smurkerfi/FaqSection";
import { ServiceVehiclesSection } from "@/components/smurkerfi/ServiceVehiclesSection";

// docs/scrape/smurkerfi.json — same <title>/<meta description> as every
// other route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/smurkerfi",
});

// docs/scrape/smurkerfi.json block 1: same photo as the home page's
// "Smurkerfi" category card (lib/categories.ts), used full-bleed as the
// hero background here. Scraped at a 512x473 thumbnail size; the actual
// downloaded file is 2493x2304 (same ~1.08 aspect), so that's what we pass
// to next/image to avoid the small-thumbnail distortion noted on the
// /thjonusta hero.
const HERO_IMAGE = { src: "/images/home/22-d2d92984.jpeg", alt: "Smurkerfi", width: 2493, height: 2304 };

const DropletIcon = CATEGORY_ICONS.smurkerfi;

export default function SmurkerfiPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Smurkerfi"
        subtitle="BEKA-MAX og Groeneveld smurkerfi í allar tegundir tækja og iðnað"
        icon={DropletIcon ? <DropletIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Smurkerfi" }]} />
        </Container>
      </div>
      <IntroSection />
      <FeaturesSection />
      <FaqSection />
      <ServiceVehiclesSection />
      <ContactCta />
    </main>
  );
}
