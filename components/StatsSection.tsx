import { Container } from "@/components/Container";
import { StatCounter } from "@/components/StatCounter";
import { stats } from "@/lib/stats";

/** Used on both the home page and /um-okkur — see lib/stats.ts. */
export function StatsSection() {
  return (
    <section className="bg-brand py-14 md:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/15">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              {/* Live site keeps a short vertical tick between rows even when
                  the grid has collapsed to one column on mobile — the
                  md:divide-x border below only draws once columns exist. */}
              {index > 0 ? (
                <div aria-hidden="true" className="mx-auto mb-6 h-5 w-px bg-white/25 md:hidden" />
              ) : null}
              <div className={index > 0 ? "md:pl-8" : undefined}>
                <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
