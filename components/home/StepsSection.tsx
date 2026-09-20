import { Container } from "@/components/Container";
import { StepCard } from "@/components/StepCard";
import { TextureDivider } from "@/components/TextureDivider";

// docs/scrape/home.json blocks 33-45.
const STEPS = [
  {
    number: "1",
    title: "Send oss en forespørsel",
    text: "Fortell oss om det du trenger å smøre.",
  },
  {
    number: "2",
    title: "Få en fast pris",
    text: "Enten du monterer selv eller om vi gjør det.",
  },
  {
    number: "3",
    title: "Når passer det for deg?",
    text: "Sammen finner vi en tid som krever minimal nedetid.",
  },
] as const;

export function StepsSection() {
  return (
    <section className="bg-white pt-16 md:pt-20">
      <Container>
        <h3 className="text-[23px] leading-[1.3] font-semibold text-black md:text-[36px]">Få fast pris i dag</h3>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              text={step.text}
              linkText="Ta kontakt →"
              href="/kontakt-oss"
            />
          ))}
        </div>
      </Container>

      {/* docs/scrape/home.json block 46: the faint dot separator on the
          boundary between this white section and the cream "Våre tjenester"
          section below it (docs/reference/home.desktop.jpg). */}
      <TextureDivider src="/images/home/02-d0cf3b93.svg" tone="faint" className="mt-14 md:mt-16" />
    </section>
  );
}
