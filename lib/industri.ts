// Content for /industri's monitoring sections (2026-11). The rest of the
// page is scraped from the old site (docs/scrape/industri.json); these
// sections are new, written on Hlynur's review note that the page needs far
// more on monitoring: not only digital, but measuring instruments, above
// all Kytölä flow meters and Assalub Lubemon.
//
// House style as lib/sentralsmoring.ts: plain statements, one term per
// thing (overvåking, smørepunkt, fordeler, mengdemåler, syklusbryter,
// indikatorstift, overtrykksventil), no slogans, no dashes in lists. The
// product facts are kept general; docs/handover.md lists what ELBA should
// confirm against the makers' datasheets.

export type MonitoringMethod = {
  eyebrow: string;
  heading: string;
  text: string;
  points: string[];
  /** Brand-folder icon (public/images/icons/brand/). */
  icon: string;
};

export const MONITORING_METHODS: MonitoringMethod[] = [
  {
    eyebrow: "Måleinstrument for olje",
    heading: "Kytölä mengdemålere",
    text: "Til sirkulasjonssmøring og oljesmurte lagre leverer vi mengdemålere fra Kytölä. Måleren sitter i oljelinjen til hvert smørested og viser mengden rett på skalaen, så operatøren ser med et blikk at hvert lager får oljen sin.",
    points: ["Avlesning på stedet, uten strøm", "Alarmgrense for lav mengde", "Signalutgang til PLS eller SCADA"],
    icon: "olje",
  },
  {
    eyebrow: "Måleinstrument for fett",
    heading: "Assalub Lubemon",
    text: "Lubemon måler fettmengden som faktisk kommer frem til hvert smørepunkt, ikke bare at pumpen går. En måler per punkt registrerer hver dose, og systemet varsler når et punkt får for lite eller for mye. Det avslører tette punkter, slangebrudd og slitte fordelere før lageret tar skade.",
    points: ["Målt mengde per smørepunkt", "Varsel ved avvik fra innstilt mengde", "Logg som dokumenterer smøringen"],
    icon: "komponenter",
  },
  {
    eyebrow: "Analog overvåking",
    heading: "Indikatorer ute på anlegget",
    text: "Indikatorstiften på fordeleren viser at syklusen går, overtrykksventilen varsler lokalt når et punkt er tett, og manometeret viser trykket i linjen. Enkle deler som virker uten strøm og nett, og som en operatør leser på runden sin.",
    points: ["Indikatorstift på hver fordeler", "Overtrykksventil på pumpen", "Manometer og nivåglass"],
    icon: "palitelighet",
  },
  {
    eyebrow: "Digital overvåking",
    heading: "Fra sensor til oversikt",
    text: "Syklusbrytere på fordelerne, trykkbrytere, nivåvakt i beholderen og pumpens egen logg samles i én oversikt. Varsler går til driftsleder eller vedlikeholdssystem, og historikken ligger klar når tilstandsrapporten skal skrives.",
    points: ["Syklus, trykk og nivå i sanntid", "Varsel på e-post, SMS eller i portal", "Integrasjon mot PLS, SCADA og vedlikeholdssystem"],
    icon: "teknisk",
  },
];

/** What is measured where, and with what. */
export const MONITORING_TABLE = {
  headers: ["Del av anlegget", "Hva vi overvåker", "Instrument"],
  rows: [
    ["Pumpe", "Går eller står, nivå i beholderen, trykk ut", "Pumpens styring, nivåvakt, trykkbryter"],
    ["Fordeler", "At hver syklus blir fullført", "Syklusbryter eller indikatorstift"],
    ["Smørepunkt, fett", "Mengden som kommer frem til hvert punkt", "Assalub Lubemon"],
    ["Smørested, olje", "Oljemengden i hver linje", "Kytölä mengdemåler"],
    ["Hele anlegget", "Status, varsler og historikk på tvers av linjer", "Digital overvåking med portal"],
  ],
};

export const FAQ_ITEMS = [
  {
    question: "Kan overvåkingen kobles til styresystemet vårt?",
    answer:
      "Ja. Syklusbrytere, trykkbrytere og nivåvakter gir et signal som går rett inn på PLS. Kytölä-målere leveres med signalutgang, og Lubemon har egen enhet som snakker med PLS eller SCADA. Vi avklarer grensesnittet med automasjonsleverandøren deres.",
  },
  {
    question: "Trenger måleinstrumentene strøm?",
    answer:
      "Ikke for å vise. En Kytölä mengdemåler leser du rett på skalaen, og indikatorstift, manometer og overtrykksventil virker alltid. Strøm trengs først når målingen skal sendes videre som signal eller varsel.",
  },
  {
    question: "Kan vi ettermontere overvåking på anlegget vi har?",
    answer:
      "Ja. Syklusbrytere og indikatorstifter passer på de fleste progressive fordelere, nivåvakt kan settes i de fleste beholdere, og Lubemon monteres på smørepunktene uavhengig av hvem som leverte anlegget. Vi ser på anlegget og foreslår hva som gir mest.",
  },
  {
    question: "Hva skjer når et punkt varsler?",
    answer:
      "Varselet forteller hvilket punkt og hva som avviker, så dere eller vi går rett til feilen i stedet for å lete. Ofte er det en tett nippel eller en klemt slange. Med serviceavtale følger vi opp varslene og tar det på neste besøk, eller før om det haster.",
  },
];
