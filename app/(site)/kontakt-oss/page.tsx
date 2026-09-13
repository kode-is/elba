import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/kontakt-oss",
});

export default function KontaktOss() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/kontakt-oss/01-f66e1710.jpeg",
          alt: "Kontakt ELBA",
          width: 1919,
          height: 2560,
        }}
        title="Kontakt oss"
      />
      <Container>
        <div className="py-12 md:py-16">
          <Breadcrumb items={[{ text: "Kontakt oss" }]} />
          <div className="mx-auto mt-10 max-w-xl md:mt-14">
            <h2 className="text-center text-section font-semibold text-black md:text-section-lg">
              Send oss en forespørsel
            </h2>
            <div className="mt-8">
              <ContactForm submitLabel="Send" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
