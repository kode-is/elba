import { Container } from "@/components/Container";
import { TeamCard } from "@/components/TeamCard";
import { team } from "@/lib/team";

// docs/scrape/um-okkur.json blocks 29-59.
const TEXT =
  "Hjá okkur starfar öflugt teymi fagfólks sem er tilbúið að takast á við hvers konar áskoranir. Við leggjum metnað okkar í að tryggja hámarks gæði og þjónustu.";

export function TeamSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Teymið okkar</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{TEXT}</p>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <TeamCard
              key={member.name}
              variant="profile"
              name={member.name}
              role={member.role}
              email={member.email}
              phone={member.phone}
              image={member.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
