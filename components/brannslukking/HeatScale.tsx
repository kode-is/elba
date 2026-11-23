import { FLUIDS } from "@/lib/brannslukking";

const MAX = 600;
const pct = (t: number) => `${(t / MAX) * 100}%`;
const TICKS = [0, 200, 400, 600];
// Turbo, exhaust and manifold surfaces run at several hundred degrees; the
// band is drawn from 300 °C and labelled without a number of its own.
const HOT_ZONE_FROM = 300;

/**
 * "Én lekkasje er nok": each fluid's flashpoint and autoignition
 * temperature on one 0–600 °C scale, against the band where turbo and
 * exhaust surfaces sit — the fluids ignite well inside the temperatures the
 * machine itself runs at. A cream card (the site's `surface`) with the
 * brand red as the heat; labels sit in their own column so nothing is drawn
 * over the hatched band.
 */
export function HeatScale() {
  return (
    <figure className="rounded-[20px] bg-surface p-6 md:p-8">
      <div className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-5 md:grid-cols-[minmax(0,9rem)_1fr]">
        <span aria-hidden="true" />
        <div className="relative h-6">
          <span
            className="absolute bottom-1 pl-2 font-ui text-[12px] leading-none font-semibold whitespace-nowrap text-brand"
            style={{ left: pct(HOT_ZONE_FROM) }}
          >
            Turbo og eksos
          </span>
        </div>

        {FLUIDS.map((f) => (
          <div key={f.name} className="contents">
            <div className="border-t border-line py-4">
              <p className="font-ui text-[15px] leading-tight font-semibold text-black md:text-[16px]">{f.name}</p>
              <p className="mt-1 font-ui text-[12px] leading-[1.45] text-ink-muted md:text-[13px]">
                {f.flashpoint} °C flammepunkt
                <br />
                {f.autoignition} °C selvantenner
              </p>
            </div>
            <div className="relative flex items-center border-t border-line">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(135deg,rgba(193,30,49,0.10)_0_7px,transparent_7px_14px)]"
                style={{ left: pct(HOT_ZONE_FROM) }}
              />
              <div aria-hidden="true" className="relative h-2.5 w-full rounded-full bg-white">
                <div
                  className="absolute inset-y-0 rounded-full bg-gradient-to-r from-brand-soft to-brand"
                  style={{ left: pct(f.flashpoint), width: `calc(${pct(f.autoignition)} - ${pct(f.flashpoint)})` }}
                />
                <span
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white"
                  style={{ left: pct(f.flashpoint) }}
                />
                <span
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
                  style={{ left: pct(f.autoignition) }}
                />
              </div>
            </div>
          </div>
        ))}

        <span aria-hidden="true" />
        <div aria-hidden="true" className="relative h-6 border-t border-line font-ui text-[11px] text-ink-muted">
          {TICKS.map((t, i) => (
            <span
              key={t}
              className={`absolute top-2 whitespace-nowrap ${
                i === 0 ? "" : i === TICKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              style={{ left: pct(t) }}
            >
              {t} °C
            </span>
          ))}
        </div>
      </div>
      <figcaption className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 font-ui text-[13px] text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-brand bg-white" /> Flammepunkt: dampen kan antennes
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-brand" /> Selvantennelse: tar fyr uten gnist
        </span>
      </figcaption>
    </figure>
  );
}
