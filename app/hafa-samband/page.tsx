import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

// docs/scrape/hafa-samband.json — same <title>/<meta description> as every
// other route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/hafa-samband",
});

export default function HafaSambandPage() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/hafa-samband/01-7ea80875.jpeg", alt: "Vinir við vegin", width: 512, height: 341 }}
        title="Hafa Samband"
      />
      <div className="bg-white pt-6">
        <Container>
          <Breadcrumb items={[{ text: "Hafa samband" }]} />
        </Container>
      </div>
      <section className="bg-white py-16 md:py-24">
        <Container>
          <h2 className="text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
            Sendu okkur fyrirspurn!
          </h2>
          <div className="mx-auto mt-10 max-w-xl">
            <ContactForm showPhone submitLabel="Senda!" />
          </div>
        </Container>
      </section>
    </main>
  );
}
