import { Container } from "@/components/Container";
import { StatCounter } from "@/components/StatCounter";
import { stats } from "@/lib/stats";

/** Used on both the home page and /om-oss — see lib/stats.ts. */
export function StatsSection() {
  return (
    <section className="bg-brand py-14 md:py-16">
      <Container>
        {/* One column on phones, 2 x 2 on tablets, four across from lg: four
            64px counters ("11000+") need ~260px each, which a 768-1023px band
            doesn't have — the last one used to push the page sideways. */}
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-white/15">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              {/* Live site keeps a short vertical tick between rows even when
                  the grid has collapsed to one column on mobile — the
                  lg:divide-x border above only draws once all four sit in a row. */}
              {index > 0 ? (
                <div aria-hidden="true" className="mx-auto mb-6 h-5 w-px bg-white/25 md:hidden" />
              ) : null}
              <div className={index > 0 ? "lg:pl-8" : undefined}>
                <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
