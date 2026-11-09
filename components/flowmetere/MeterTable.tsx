import { COMPARISON, METERS } from "@/lib/flowmetere";

/**
 * Variable area against oval gear, side by side. Dressed as /brannslukking's
 * ComparisonTable (and SpecTable): white, `table-head` header row, `line`
 * rules, Inter `text-cell`.
 */
export function MeterTable() {
  return (
    <div className="overflow-x-auto rounded-[12px] bg-white">
      <table className="w-full min-w-[520px] border-collapse font-ui text-left text-cell">
        <caption className="sr-only">Flowmetere med variabelt areal sammenlignet med ovalhjulsmålere</caption>
        <thead className="bg-table-head">
          <tr>
            <th scope="col" className="border-b-2 border-line px-4 py-3 font-semibold text-table-ink">
              <span className="sr-only">Egenskap</span>
            </th>
            <th scope="col" className="border-b-2 border-line px-4 py-3 font-semibold text-table-ink">
              {METERS.va.label}
            </th>
            <th scope="col" className="border-b-2 border-brand px-4 py-3 font-semibold text-brand">
              {METERS.oval.label}
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((row) => (
            <tr key={row.feature} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-4 py-3 font-semibold text-table-ink">
                {row.feature}
              </th>
              <td className="px-4 py-3 text-table-ink">{row.va}</td>
              <td className="px-4 py-3 text-table-ink">{row.oval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
