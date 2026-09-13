import Link from "next/link";
import { Container } from "@/components/Container";
import { ServiceCardsGrid } from "@/components/ServiceCards";

export function ServicesSection() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">Våre tjenester</h2>
          <Link
            href="/tjenester"
            className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Se utvalget
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-600 md:text-right md:text-base">
          Gi oss utfordringen så skal vi se hva vi klarer
        </p>

        <ServiceCardsGrid className="mt-10" />
      </Container>
    </section>
  );
}
