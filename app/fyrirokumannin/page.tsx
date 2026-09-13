import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { SeatCoversSection } from "@/components/fyrirokumannin/SeatCoversSection";
import { FloorMatsSection } from "@/components/fyrirokumannin/FloorMatsSection";
import { ShoeTraySection } from "@/components/fyrirokumannin/ShoeTraySection";
import { LightingSection } from "@/components/fyrirokumannin/LightingSection";

// docs/scrape/fyrirokumannin.json — same <title>/<meta description> as
// every other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/fyrirokumannin",
});

// docs/scrape/fyrirokumannin.json block 1. Scraped at a 512x683 thumbnail;
// the actual downloaded file is 3024x4032 (same ~0.75 aspect), so that's
// what is passed to next/image to avoid the small-thumbnail distortion
// noted on the /thjonusta hero (see components/smurkerfi's HERO_IMAGE
// comment).
const HERO_IMAGE = {
  src: "/images/home/26-94902b25.jpeg",
  alt: "Sætisáklæði",
  width: 3024,
  height: 4032,
};

const CarIcon = CATEGORY_ICONS.fyrirokumannin;

export default function FyrirOkumanninPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Fyrir ökumanninn"
        subtitle="Sætisáklæði, gólfmottur, ljósabúnaður og fleira - sérsniðið að þínu tæki"
        icon={CarIcon ? <CarIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Fyrir ökumanninn" }]} />
        </Container>
      </div>
      <SeatCoversSection />
      <FloorMatsSection />
      <ShoeTraySection />
      <LightingSection />
      <ContactCta />
    </main>
  );
}
