// Headline stat counters, shared by the home page and /um-okkur (identical
// in both docs/scrape/home.json and docs/scrape/um-okkur.json). Settled
// values (patched from the mid-animation capture 483/133/4/4 to the values
// verified live and in the server-rendered HTML). The "Ísett smurkefi" label
// typo is preserved verbatim.

export type Stat = { value: string; suffix: string; label: string };

export const stats: Stat[] = [
  { value: "480", suffix: "+", label: "Ísett smurkefi" },
  { value: "130", suffix: "+", label: "Innflutt tæki" },
  { value: "1", suffix: "klst", label: "Fyrirspurnum svarað innan" },
  { value: "50", suffix: "+", label: "Vörumerki" },
];
