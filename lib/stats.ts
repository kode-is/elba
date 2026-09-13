// Headline stat counters, shared by the home page and /om-oss.
// Verbatim from docs/scrape/home.json blocks 69-79.

export type Stat = { value: string; suffix: string; label: string };

export const stats: Stat[] = [
  { value: "184", suffix: "+", label: "Montasjer i året" },
  { value: "14", suffix: "", label: "Års erfaring" },
  { value: "10984", suffix: "+", label: "Artikler på lager" },
  { value: "5984", suffix: "+", label: "Fornøyde kunder" },
];
