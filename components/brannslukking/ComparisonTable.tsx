import { CheckIcon } from "@/components/icons";
import { COMPARISON } from "@/lib/brannslukking";

function Mark({ yes }: { yes: boolean }) {
  return yes ? (
    <>
      <CheckIcon className="mx-auto h-5 w-5 text-brand" />
      <span className="sr-only">Ja</span>
    </>
  ) : (
    <>
      <span aria-hidden="true" className="text-ink-faint">
        –
      </span>
      <span className="sr-only">Nei</span>
    </>
  );
}

/**
 * Protega against what the customer already has: a handheld extinguisher, or
 * a sprinkler. Dressed as SpecTable (the product tables): white, `table-head`
 * header row, `line` rules, Inter `text-cell`.
 */
export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-[12px] bg-white">
      <table className="w-full min-w-[520px] border-collapse font-ui text-left text-cell">
        <caption className="sr-only">Protega sammenlignet med håndslukker og sprinkleranlegg</caption>
        <thead className="bg-table-head">
          <tr>
            <th scope="col" className="border-b-2 border-line px-4 py-3 font-semibold text-table-ink">
              <span className="sr-only">Egenskap</span>
            </th>
            <th scope="col" className="border-b-2 border-brand px-4 py-3 text-center font-semibold text-brand">
              Protega
            </th>
            <th scope="col" className="border-b-2 border-line px-4 py-3 text-center font-semibold text-table-ink">
              Håndslukker
            </th>
            <th scope="col" className="border-b-2 border-line px-4 py-3 text-center font-semibold text-table-ink">
              Sprinkler
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((row) => (
            <tr key={row.feature} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-4 py-3 font-normal text-table-ink">
                {row.feature}
              </th>
              <td className="px-4 py-3 text-center">
                <Mark yes={row.protega} />
              </td>
              <td className="px-4 py-3 text-center">
                <Mark yes={row.handheld} />
              </td>
              <td className="px-4 py-3 text-center">
                <Mark yes={row.sprinkler} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
