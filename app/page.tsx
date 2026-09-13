import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { IndustryStrip } from "@/components/IndustryStrip";
import { StepsSection } from "@/components/home/StepsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AdvisorySection } from "@/components/home/AdvisorySection";
import { ContactSection } from "@/components/home/ContactSection";
import { ArticlesSection } from "@/components/home/ArticlesSection";
import { StatsSection } from "@/components/StatsSection";
import { Container } from "@/components/Container";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "Hvert år leverer vi sentralsmøreanlegg til mange tusen smørepunkter, enten montert av egne montører eller hvor du selv setter opp systemet.",
  path: "/",
});

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <IndustryStrip />
      <StepsSection />
      <ServicesSection />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <AdvisorySection />
            <ContactSection />
          </div>
        </Container>
      </section>

      <StatsSection />
      <ArticlesSection />
    </main>
  );
}
