import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ServiceCardsGrid } from "@/components/ServiceCards";
import { ContactCta } from "@/components/ContactCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/tjenester",
});

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
