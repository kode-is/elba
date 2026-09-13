import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { IntroSection } from "@/components/oryggisrudur/IntroSection";
import { StrengthsSection } from "@/components/oryggisrudur/StrengthsSection";
import { UseCasesSection } from "@/components/oryggisrudur/UseCasesSection";

// docs/scrape/oryggisrudur.json — same <title>/<meta description> as every
// other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/oryggisrudur",
});

// docs/scrape/oryggisrudur.json block 2: same photo as the home page's
// Öryggisrúður category card (lib/categories.ts). Scraped at a 512x384
// thumbnail; the actual downloaded file is 4032x3024 (same 4:3 aspect), so
// that's what's passed to next/image to avoid the small-thumbnail
// distortion noted on the /thjonusta hero (see components/smurkerfi's
// HERO_IMAGE comment for the same fix).
const HERO_IMAGE = {
  src: "/images/home/24-a996c2c4.jpg",
  alt: "Starfsmaður Skralla að setja upp Hammerglass-rúðu",
  width: 4032,
  height: 3024,
};

const ExpandIcon = CATEGORY_ICONS.oryggisrudur;

export default function OryggisrudurPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Öryggisrúður"
        subtitle="Óbrjótanlegar og eldhamlandi rúður sem þola erfiðustu aðstæður"
        icon={ExpandIcon ? <ExpandIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Öryggisrúður" }]} />
        </Container>
      </div>
      <IntroSection />
      <StrengthsSection />
      <UseCasesSection />
      <ContactCta />
    </main>
  );
}
