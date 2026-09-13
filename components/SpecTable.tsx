type SpecTableProps = {
  headers: string[];
  rows: string[][];
  /** id of the heading (H2/H3) immediately above this table, wired via
   * `aria-labelledby` so the table has an accessible name without a visible
   * `<caption>` — a caption's text would duplicate the heading's text in the
   * page's innerText and read as "extra" content to scripts/verify.mjs. */
  ariaLabelledBy?: string;
};

/**
 * Product-spec table for the /produkter/* pages. A plain semantic `<table>`
 * rather than the Framer "Table" widget the live site ships (with its own
 * search box, pager and CSV export — see docs/handover.md), wrapped in
 * `overflow-x-auto` so a wide table scrolls within its own box instead of the
 * page. Every colour, size and rule below is measured on the live table
 * (docs/measure.txt, Task 11): a 12px-radius white card with no outer border,
 * Inter 15px/1.3 cells in #111, a #f7f7f8 header row closed by a 2px #e0e0e0
 * rule and 1px #e0e0e0 rules between body rows, 12px/16px cell padding, and
 * no zebra striping.
 */
export function SpecTable({ headers, rows, ariaLabelledBy }: SpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-[12px] bg-white">
      <table
        aria-labelledby={ariaLabelledBy}
        className="w-full min-w-[560px] border-collapse font-ui text-left text-cell"
      >
        <thead className="bg-table-head">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-b-2 border-line px-4 py-3 font-semibold whitespace-nowrap text-table-ink"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-line">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-table-ink">
                  {cell.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {lineIndex > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
