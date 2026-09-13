import { Container } from "@/components/Container";
import { DotDivider } from "@/components/DotDivider";
import { StepCard } from "@/components/StepCard";

const STEPS = [
  {
    number: "1",
    title: "Sendu okkur fyrirspurn",
    text: "Lýstu fyrir okkur þínum þörfum og okkar sérfræðingar munu finna bestu lausnina.",
    linkText: "Senda fyrirspurn →",
    href: "/hafa-samband",
  },
  {
    number: "2",
    title: "Fáðu fast verð í verkið",
    text: "Eftir að hafa greint allar þarfir munum við bjóða fast verð í verkið.",
    linkText: "Fá fast verð →",
    href: "/hafa-samband",
  },
  {
    number: "3",
    title: "Hvenær hentar þér?",
    text: "Í samvinnu við þig finnum við tíma í ísetninguna.",
    linkText: "Finna tíma →",
    href: "/hafa-samband",
  },
];

export function StepsSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 md:pt-24">
      <Container>
        <h3 className="text-2xl font-semibold text-neutral-900 md:text-3xl">
          Okkar þjónusta við smurkerfi
        </h3>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </Container>

      {/* Decorative dot pattern (docs/scrape/home.json block 39, a 0x0 CSS
          background rather than a visible <img>); live gap above: 75/68 px. */}
      <DotDivider className="mt-[75px] md:mt-[68px]" />
    </section>
  );
}
