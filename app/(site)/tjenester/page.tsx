import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ServiceCardsGrid } from "@/components/ServiceCards";
import { ContactCta } from "@/components/ContactCta";
import { pageMetadata } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-meta";

export const metadata = pageMetadata(PAGE_META["/tjenester"]);

export default function Tjenester() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/tjenester/01-68fb1302.jpeg",
          alt: "",
          width: 1439,
          height: 1919,
        }}
        title="Tjenester"
        crumbs={[{ text: "Tjenester" }]}
      />
      <Container>
        <div className="py-12 md:py-16">
          <ServiceCardsGrid />
        </div>
      </Container>
      <ContactCta />
    </main>
  );
}
