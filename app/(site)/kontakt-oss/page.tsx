import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-meta";

export const metadata = pageMetadata(PAGE_META["/kontakt-oss"]);

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
        crumbs={[{ text: "Kontakt oss" }]}
      />
      <Container>
        <div className="py-12 md:py-16">
          <div className="mx-auto max-w-xl">
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
