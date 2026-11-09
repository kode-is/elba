import { pageMetadata } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-meta";
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

export const metadata = pageMetadata(PAGE_META["/"]);

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <IndustryStrip />
      {/* First thing under the hero: Hlynur asked for Produkter "efst á síðunni
          sem sér dæmi" — its own item at the top, not a card among the services. */}
      <ProductsSection />
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
