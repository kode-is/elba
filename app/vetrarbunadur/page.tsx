import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { IntroSection } from "@/components/vetrarbunadur/IntroSection";
import { ChainsSection } from "@/components/vetrarbunadur/ChainsSection";
import { PlowsSection } from "@/components/vetrarbunadur/PlowsSection";

// docs/scrape/vetrarbunadur.json — same <title>/<meta description> as every
// other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/vetrarbunadur",
});

// docs/scrape/vetrarbunadur.json block 1 (same photo used as the
// /thjonusta hero — docs/scrape/thjonusta.json). Scraped at a 384x512
// thumbnail; the actual downloaded file is 3024x4032 (same 3:4 aspect), so
// that's what is passed to next/image to avoid the small-thumbnail
// distortion noted on the /thjonusta hero (see components/smurkerfi's
// HERO_IMAGE comment).
const HERO_IMAGE = { src: "/images/thjonusta/08-e6009210.jpeg", alt: "", width: 3024, height: 4032 };

const SnowflakeIcon = CATEGORY_ICONS.vetrarbunadur;

export default function VetrarbunadurPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Vetrarbúnaður"
        subtitle="Snjókeðjur, snjóplógar og vængjaskóflur í miklu úrvali"
        icon={SnowflakeIcon ? <SnowflakeIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Vetrarbúnaður" }]} />
        </Container>
      </div>
      <IntroSection />
      <ChainsSection />
      <PlowsSection />
      <ContactCta />
    </main>
  );
}
