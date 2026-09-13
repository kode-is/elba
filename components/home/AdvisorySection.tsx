import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { TeamCard } from "@/components/TeamCard";

const TEAM = [
  { name: "Villi", image: { src: "/images/home/27-d812c419.jpg", alt: "Villi", width: 136, height: 90 } },
  { name: "Örvar", image: { src: "/images/home/28-23d4abab.jpg", alt: "Örvar", width: 136, height: 90 } },
  { name: "Þórir", image: { src: "/images/home/29-ad270c68.jpg", alt: "Þórir", width: 136, height: 90 } },
];

export function AdvisorySection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Fagmannleg ráðgjöf</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
              Við erum traustir ráðgjafar og höfum aðstoðað fjölda fyrirtækja og einstaklinga við
              að finna notuð tæki og búnað erlendis. Teymið okkar býr yfir áratuga reynslu og sér
              um ferlið frá upphafi til enda.
            </p>
            <div className="mt-10 flex flex-nowrap gap-3 sm:gap-8">
              {TEAM.map((member) => (
                <TeamCard key={member.name} name={member.name} image={member.image} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#f0f4fa] p-8 md:p-10">
            <h3 className="text-center font-ui text-xl font-semibold text-neutral-900">Hafa samband</h3>
            <div className="mt-6">
              <ContactForm submitLabel="Senda" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
