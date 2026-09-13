import Link from "next/link";
import { Container } from "@/components/Container";
import { ServiceCardsGrid } from "@/components/ServiceCards";

export function ServicesSection() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-section font-semibold text-black md:text-section-lg">Våre tjenester</h2>
          <Link
            href="/tjenester"
            className="inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
          >
            Se utvalget
          </Link>
        </div>
        <p className="mt-4 text-lead text-ink-muted md:text-right md:text-lead-lg">
          Gi oss utfordringen så skal vi se hva vi klarer
        </p>

        <ServiceCardsGrid className="mt-10" />
      </Container>
    </section>
  );
}
