import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { IndustryStrip } from "@/components/IndustryStrip";
import { StepsSection } from "@/components/home/StepsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AdvisorySection } from "@/components/home/AdvisorySection";
import { ContactSection } from "@/components/home/ContactSection";
import { ArticlesSection } from "@/components/home/ArticlesSection";
import { StatsSection } from "@/components/StatsSection";
import { Container } from "@/components/Container";
import { ProtegaBand } from "@/components/brannslukking/ProtegaBand";

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
      {/* First thing under the hero: Hlynur asked for Produkter "efst á síðunni
          sem sér dæmi" — its own item at the top, not a card among the services. */}
      <ProductsSection />
      {/* Not on live: the new Protega fire-suppression service, kept below
          Produkter so the catalog stays first under the hero. */}
      <ProtegaBand
        className="pt-16 md:pt-24"
        heading="Nå beskytter vi maskinene dine mot brann også"
        text="ELBA er forhandler og montør av automatisk brannslukking fra Protega Solutions. Samme kunder, samme maskiner, samme montører – nå med brannvern som slår inn av seg selv."
        points={["Helt mekanisk, uten strøm", "Beskytter døgnet rundt", "Montert sammen med smøringen"]}
      />
      <StepsSection />
      <ServicesSection />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_450px] lg:gap-16">
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
