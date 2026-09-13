import Link from "next/link";
import { Container } from "./Container";
import { navCta } from "@/lib/site";

export function ContactCta() {
  return (
    <section className="bg-brand-dark">
      <Container className="flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between md:py-12">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">
          Sendu okkur fyrirspurn
        </h3>
        <Link
          href={navCta.href}
          className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-dark"
        >
          {navCta.text}
        </Link>
      </Container>
    </section>
  );
}
