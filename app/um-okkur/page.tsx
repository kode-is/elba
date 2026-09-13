import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { StatsSection } from "@/components/StatsSection";
import { AboutIntro } from "@/components/um-okkur/AboutIntro";
import { GoalsSection } from "@/components/um-okkur/GoalsSection";
import { TeamSection } from "@/components/um-okkur/TeamSection";

// docs/scrape/um-okkur.json — same <title>/<meta description> as every other
// route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/um-okkur",
});

export default function UmOkkurPage() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/um-okkur/01-143b289f.png",
          alt: "Starfsmenn Skralla að vinna í vinnuvél",
          width: 1440,
          height: 642,
        }}
        title="Um okkur"
      />
      <div className="bg-white pt-6">
        <Container>
          <Breadcrumb items={[{ text: "Um okkur" }]} />
        </Container>
      </div>
      <AboutIntro />
      <GoalsSection />
      <StatsSection />
      <TeamSection />
      <ContactCta />
    </main>
  );
}
