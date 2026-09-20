// Headline stat counters, shared by the home page and /om-oss.
//
// The labels come from docs/scrape/home.json blocks 69-79. The values are
// ELBA's own confirmed round figures, which deliberately replace the ones
// scraped off live (184 / 14 / 10984 / 5984 — those were read off live's
// count-up animation wherever it happened to settle, the open question in
// docs/handover.md "Still needs you or Hlynur" #11, now answered).
// scripts/verify.mjs allows these as local-only text for that reason.

export type Stat = { value: string; suffix: string; label: string };

export const stats: Stat[] = [
  { value: "200", suffix: "+", label: "Montasjer i året" },
  { value: "30", suffix: "", label: "Års erfaring" },
  { value: "11000", suffix: "+", label: "Artikler på lager" },
  { value: "6000", suffix: "+", label: "Fornøyde kunder" },
];
