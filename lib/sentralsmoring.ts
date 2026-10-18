// Content for /anlegg — progressive central lubrication for construction
// machines, built around an animated excavator (components/sentralsmoring/
// LubricationDemo.tsx) and a divider cutaway (DividerDemo.tsx).
//
// The drawing is a 50-tonne class excavator (CAT 350 proportions) with the
// parts ELBA fits: a BEKA EP-1 piston pump, a main BEKA MX-F progressive
// divider on the upper frame and a secondary one on the boom. Product facts
// are from Groeneveld-BEKA's product pages (EP-1, MX-F); greasing intervals
// from the machine makers' maintenance schedules. docs/handover.md lists the
// sources and what is still for ELBA to confirm.
//
// House style for this copy: plain statements, one term per thing
// (sentralsmøring for the method, smøreanlegg for the hardware,
// hovedfordeler/sekundærfordeler, smørepunkt, bolt og bøssing, fettpresse,
// overtrykksventil, indikatorstift, overvåking), no slogans, and at most one
// dash per paragraph — none in headings, status lines or lists.

export type LubeMode = "automatisk" | "manuell";

export type DemoStep = { heading: string; text: string };

export const MODES: Record<LubeMode, { label: string; summary: string; steps: DemoStep[] }> = {
  automatisk: {
    label: "Sentralsmøring",
    summary:
      "Styringen starter pumpen med faste pauser mens maskinen er i drift. Hvert smørepunkt får små doser i fast rekkefølge, mens bom, stikke og skuffe jobber.",
    steps: [
      {
        heading: "Pumpen starter etter fast pause",
        text: "Pausetiden telles mens tenningen er på. Når den er ute, går EP-1 en innstilt tid, og røreverket i beholderen mater fettet frem til pumpeelementet.",
      },
      {
        heading: "Fordelerne doserer så lenge pumpen går",
        text: "Hovedfordeleren på overvognen går rundt og rundt og gir hvert punkt sin dose i fast rekkefølge. Tre utløp er slått sammen og mater sekundærfordeleren på bommen, som forsyner stikke og skuffe.",
      },
      {
        heading: "Fettet kommer inn under arbeid",
        text: "Dosene kommer mens maskinen graver og løfter. Lastretningen i leddene skifter hele tiden, så også den belastede siden av bolten får nytt fett.",
      },
    ],
  },
  manuell: {
    label: "Manuell smøring",
    summary:
      "Med fettpresse smøres maskinen én gang ved skiftstart, slik maskinprodusentene foreskriver for skuffeleddene. Fettet må holde til neste dag.",
    steps: [
      {
        heading: "Smøring ved skiftstart",
        text: "Maskinen står med skuffa på bakken, og føreren går rundt med fettpressen. Punkter som er vanskelige å nå, blir lett hoppet over.",
      },
      {
        heading: "Overskuddet presses ut",
        text: "Det er riktig å smøre til rent fett kommer ut ved pakningene. Det lageret ikke tar imot, legger seg utenpå og samler skitt.",
      },
      {
        heading: "Fettfilmen tynnes ut",
        text: "Utover skiftet blir fettfilmen tynnere, raskest i vått og sandholdig arbeid. Den belastede siden av bolten tørker først.",
      },
    ],
  },
};

/** The points in the drawing, in the order the dividers serve them. A 50-tonne machine has more. */
export const MAIN_POINTS = ["Svingkrans", "Bomsylinder, fot", "Bomfot", "Bomsylinder, stang", "Stikkesylinder, fot"] as const;
export const SECONDARY_POINTS = [
  "Bom/stikke-ledd",
  "Stikkesylinder, stang",
  "Skuffesylinder, fot",
  "Mellomlenke",
  "Lenkeledd",
  "Skuffelenke",
  "Skuffebolt",
] as const;
export const LUBE_POINTS = [...MAIN_POINTS, ...SECONDARY_POINTS];
/** The one the operator skips in the manual round: on top of the boom, hard to reach from the ground. */
export const SKIPPED_POINT = "Stikkesylinder, fot";

/** Three moments of the working day, as the grease chart shows them. */
export const DAY_MOMENTS = [
  {
    when: "Etter fettpressen",
    heading: "Mer enn lageret tar imot",
    text: "Det er riktig å smøre til rent fett kommer ut ved pakningene. Alt etter det havner utenpå bolten og samler grus og skitt.",
    tone: "cream",
  },
  {
    when: "Utover skiftet",
    heading: "Tynnere fettfilm",
    text: "Fettfilmen tynnes ut gjennom dagen, raskest i vått og sandholdig arbeid. Punkter som er vanskelige å nå, blir lett hoppet over.",
    tone: "cream",
  },
  {
    when: "Med sentralsmøring",
    heading: "Jevn fettmengde",
    text: "Små doser med faste pauser holder fettmengden jevn gjennom hele skiftet, også i punktene ingen rekker med fettpressen.",
    tone: "red",
  },
] as const;

/** The two BEKA components the drawing is modelled on. Facts from Groeneveld-BEKA's product pages. */
export const COMPONENTS = [
  {
    kind: "pump",
    name: "BEKA EP-1",
    role: "Pumpen",
    text: "Elektrisk stempelpumpe for 12 eller 24 V. Beholderen er gjennomsiktig, så du ser fettnivået, og et røreverk mater fettet frem til pumpeelementet. Pumpen styres med pause- og gangtid, fra egen styreenhet eller maskinens.",
    facts: ["Beholder fra 1,9 til 16 liter", "Fett til og med NLGI 2", "Overtrykksventil på hvert pumpeelement", "Tetthetsklasse IP65"],
  },
  {
    kind: "distributor",
    name: "BEKA MX-F",
    role: "Fordeleren",
    text: "Fordeleren deler fettet fra pumpen mellom smørepunktene. Den bygges med 3 til 12 stempler, to utløp per stempel, og utløp kan slås sammen der et punkt trenger mer fett.",
    facts: ["Sink-nikkel-belagt stål", "0,025 til 0,105 cm³ per utløp og slag", "Indikatorstift eller sensor for syklusovervåking"],
  },
] as const;

/** The divider cutaway (components/sentralsmoring/DividerDemo.tsx): running normally, and with outlet 3 blocked. */
export type DividerMode = "normal" | "blokkert";

export const DIVIDER_MODES: Record<DividerMode, { label: string; summary: string; steps: DemoStep[] }> = {
  normal: {
    label: "Normal drift",
    summary:
      "Tre stempler og seks utløp. Hvert stempel styrer trykket til det neste, så de går i fast rekkefølge, og hvert slag sender en fast mengde ut til ett smørepunkt.",
    steps: [
      {
        heading: "Trykket skyver ett stempel",
        text: "Fettet fra pumpen presser stempelet til endestopp. Fettet foran stempelet går ut gjennom ett utløp.",
      },
      {
        heading: "Stempelet åpner veien til det neste",
        text: "I endestopp åpner sporet i stempelet kanalen til neste stempel. A, B og C går til høyre og så tilbake, og leverer til utløp 1 til 6.",
      },
      {
        heading: "Indikatorstiften viser syklusen",
        text: "Stiften følger stempel A ut og inn én gang per runde. Går den, går fordeleren. Slanger og rør må likevel sjekkes, for et avrevet rør ser ikke stiften.",
      },
    ],
  },
  blokkert: {
    label: "Tett utløp",
    summary:
      "Et tett smørepunkt stopper hele fordeleren. Står en sekundærfordeler, stopper også hovedfordeleren som mater den, og hele smøreanlegget står.",
    steps: [
      {
        heading: "To utløp får fett",
        text: "Stempel A og B går som normalt og leverer til utløp 1 og 2.",
      },
      {
        heading: "Utløp 3 er tett",
        text: "Stempel C får ikke skjøvet fettet ut og blir stående. Da kan heller ikke A og B gå videre, og ingen av punktene på fordeleren får fett.",
      },
      {
        heading: "Trykket stiger",
        text: "Overtrykksventilen på pumpen åpner og slipper ut fett, og indikatorstiften står stille. Med overvåking får du varsel når syklusen ikke blir fullført.",
      },
    ],
  },
};

export const FAQ_ITEMS = [
  {
    question: "Smører anlegget når maskinen står?",
    answer:
      "Nei. Vi kobler styringen til tenningen, så pausetiden telles bare når maskinen er på. Når maskinen er slått av, står også pumpen.",
  },
  {
    question: "Hvor ofte smører det, og hvor mye?",
    answer:
      "Pausetid og gangtid stilles inn etter maskin, antall punkter og hvordan maskinen brukes. Fordeleren låser forholdet mellom punktene, mens pumpens gangtid avgjør hvor mye fett som går ut totalt. Det stiller vi inn ved montering og justerer ved behov.",
  },
  {
    question: "Hva skjer hvis et smørepunkt tetter seg?",
    answer:
      "Fordeleren stopper, og står en sekundærfordeler, stopper også hovedfordeleren. Indikatorstiften står stille, og overtrykksventilen på pumpen slipper ut fett. Uten overvåking må noen se det, så vi anbefaler syklusovervåking som varsler når fordeleren ikke går rundt.",
  },
  {
    question: "Kan anlegget ettermonteres?",
    answer:
      "Ja. Vi leverer modelltilpassede kit for både nye og brukte maskiner. Ettermontering er særlig aktuelt på maskiner med høy belastning, mange smørepunkter eller varierende vedlikeholdsrutiner.",
  },
  {
    question: "Hva med vinter og kulde?",
    answer:
      "Fettet må passe temperaturen og lengden på rørene. Med for stivt fett i kulde kan overtrykksventilen slippe ut fett uten at noe er tett. Vi velger fett og rørdimensjon etter hvor maskinen skal jobbe.",
  },
  {
    question: "Hva skjer om anlegget får en feil?",
    answer:
      "Uten overvåking ser du feilen på indikatorstiften og på overtrykksventilen. Med overvåking får føreren eller verkstedet varsel. Vi har deler på lager og hjelper med feilsøkingen.",
  },
];
