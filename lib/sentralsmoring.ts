// Content for /anlegg — progressive central lubrication for construction
// machines, built around an animated excavator (components/sentralsmoring/
// LubricationDemo.tsx).
//
// The drawing is a 50-tonne class excavator (CAT 350 proportions) with the
// parts ELBA fits: a BEKA EP-1 piston pump (black pump housing, transparent
// reservoir with an agitator blade), a main BEKA MX-F progressive divider on
// the upper frame and a secondary one on the boom. A second animation
// (components/sentralsmoring/DividerDemo.tsx) opens a divider up. Product
// facts below are from BEKA's own data sheets; the rest of the copy is new
// and listed in docs/handover.md for review.

export type LubeMode = "automatisk" | "manuell";

export type DemoStep = { heading: string; text: string };

export const MODES: Record<LubeMode, { label: string; summary: string; steps: DemoStep[] }> = {
  automatisk: {
    label: "Sentralsmøring",
    summary:
      "Pumpen går mens maskinen jobber. Hvert smørepunkt får en liten, fast dose med jevne mellomrom – mens bom, stikke og skuffe er i bevegelse og under last.",
    steps: [
      {
        heading: "Pumpen går med maskinen",
        text: "EP-1 starter en smøresyklus med fast intervall mens maskinen er i drift. Røreverket i reservoaret mater fettet frem til pumpeelementet.",
      },
      {
        heading: "Fordelerne doserer – ett punkt etter det andre",
        text: "Hovedfordeleren på overvognen gir hvert punkt der en fast dose, i fast rekkefølge. Ett utløp går opp bommen til en sekundærfordeler, som forsyner stikke og skuffe på samme måte.",
      },
      {
        heading: "Fettet går inn mens bolten beveger seg",
        text: "Fettet presses inn mens maskinen graver, løfter og svinger, og fordeles rundt hele bolten – i alle posisjoner, ikke bare der det var ledig da maskinen sto.",
      },
    ],
  },
  manuell: {
    label: "Manuell smøring",
    summary:
      "Fettpressen ved oppstart: alt fettet går inn på én gang, med maskinen parkert. Så skal det vare et helt skift.",
    steps: [
      {
        heading: "Smøring i stå-posisjon",
        text: "Føreren smører punktene med fettpresse før skiftet, med maskinen parkert – ofte med flere slag enn lageret tar imot.",
      },
      {
        heading: "Overskuddet presses ut",
        text: "Det lageret ikke tar imot, legger seg utenpå og samler grus og støv. Fettet havner på den siden av bolten som var ubelastet da maskinen sto.",
      },
      {
        heading: "Tørt utover dagen",
        text: "Etter noen timer i drift er fettet brukt opp. Resten av skiftet går bolter og bøssinger med for lite smøring – det er da slitasjen skjer.",
      },
    ],
  },
};

/** The points in the drawing, in the order the dividers serve them. */
export const MAIN_POINTS = ["Svingkrans", "Bomsylinder, fot", "Bomfot", "Bomsylinder, stang", "Stikkesylinder, fot"] as const;
export const SECONDARY_POINTS = ["Bom/stikke-ledd", "Stikkesylinder, stang", "Skuffesylinder, fot", "Skuffelenke", "Skuffebolt"] as const;
export const LUBE_POINTS = [...MAIN_POINTS, ...SECONDARY_POINTS];

/** "For mye, for lite, riktig" — the three moments the grease chart shows. */
export const DAY_MOMENTS = [
  {
    when: "Kl. 07",
    heading: "For mye",
    text: "Med fettpressen fylles lagrene til det renner over. Overskuddet presses ut, samler grus og havner på bakken.",
    tone: "cream",
  },
  {
    when: "Kl. 14",
    heading: "For lite",
    text: "Etter noen timer i drift er fettet brukt opp. Bolter og bøssinger går tørre resten av skiftet – det er da slitasjen skjer.",
    tone: "cream",
  },
  {
    when: "Hele dagen",
    heading: "Riktig mengde",
    text: "Sentralsmøringen gir små doser med jevne mellomrom. Mengden i lageret holder seg rundt det optimale fra første til siste time – med mindre fett totalt.",
    tone: "red",
  },
] as const;

/** The two BEKA components the drawing is modelled on. Facts from BEKA's data sheets. */
export const COMPONENTS = [
  {
    kind: "pump",
    name: "BEKA EP-1",
    role: "Pumpen",
    text: "Kompakt, elektrisk stempelpumpe for 12 eller 24 V. Det gjennomsiktige reservoaret viser fettnivået med et blikk, og røreverket holder fettet i bevegelse ned mot pumpeelementet.",
    facts: ["Reservoar fra 1,9 til 16 liter", "Fett til og med NLGI 2", "IP65 – tåler spyling og vær"],
  },
  {
    kind: "distributor",
    name: "BEKA MX-F",
    role: "Den progressive fordeleren",
    text: "Fordeleren deler fettet fra pumpen mellom smørepunktene. Seksjonene stables etter hvor mange punkter maskinen har, og hvert utløp får sin faste dose for hver syklus.",
    facts: ["Forsinket stål, modulær oppbygging", "Fra 0,025 til 0,105 cm³ per utløp", "Indikatorstift viser at syklusen går"],
  },
] as const;

/** The divider cutaway (components/sentralsmoring/DividerDemo.tsx): running normally, and with outlet 3 blocked. */
export type DividerMode = "normal" | "blokkert";

export const DIVIDER_MODES: Record<DividerMode, { label: string; summary: string; steps: DemoStep[] }> = {
  normal: {
    label: "Normal drift",
    summary:
      "Tre stempler, seks utløp. Fettet fra pumpen skyver ett stempel om gangen, og hvert slag sender en fast dose ut til ett smørepunkt.",
    steps: [
      {
        heading: "Trykket skyver ett stempel",
        text: "Fettet fra pumpen presser stempelet til endestopp. Fettet foran stempelet går ut gjennom ett utløp – alltid samme mengde.",
      },
      {
        heading: "Først da går turen videre",
        text: "Når stempelet står i endestopp, åpnes kanalen til neste stempel. A, B og C til høyre, så A, B og C tilbake – utløp 1 til 6, og så rundt igjen.",
      },
      {
        heading: "Indikatorstiften viser at det går",
        text: "Stiften følger stempel A ut og inn for hver runde. Beveger den seg mens pumpen går, får alle punktene fett.",
      },
    ],
  },
  blokkert: {
    label: "Tett utløp",
    summary:
      "Et tett smørepunkt stopper hele fordeleren. Det høres ille ut, men det er nettopp poenget: feilen blir synlig med en gang, i stedet for som en slitt bolt.",
    steps: [
      {
        heading: "To utløp får fett",
        text: "Stempel A og B går som normalt og leverer til utløp 1 og 2.",
      },
      {
        heading: "Utløp 3 er tett",
        text: "Stempel C kan ikke skyve fettet ut, og blir stående. Ingen stempler bak det kan gå videre – ingen punkter blir stående tørre i det stille.",
      },
      {
        heading: "Trykket stiger, stiften står",
        text: "Overtrykksventilen åpner og viser fett, og indikatorstiften står stille. Med overvåking får føreren varsel med en gang.",
      },
    ],
  },
};

export const FAQ_ITEMS = [
  {
    question: "Smører systemet når maskinen står?",
    answer:
      "Nei. Pumpen går når maskinen er i drift, og intervallet regnes i driftstid. Fettet tilføres mens boltene beveger seg og er under last, og det er da det fordeles best. Står maskinen, står også smøringen – og ingenting presses ut til ingen nytte.",
  },
  {
    question: "Hvor ofte smører den, og hvor mye?",
    answer:
      "Intervall og dose stilles inn etter maskin, antall punkter og hvordan maskinen brukes. Hvert utløp på fordeleren har en fast dose, og vi dimensjonerer systemet slik at hvert punkt får det det trenger – verken mer eller mindre.",
  },
  {
    question: "Hva skjer hvis et smørepunkt tetter seg?",
    answer:
      "I et progressivt system må hvert stempel fullføre før det neste kan bevege seg. Tetter ett punkt seg, stopper hele fordeleren. Indikatorstiften står stille og overtrykksventilen viser fett – du ser feilen før den blir til slitasje. Med elektronisk overvåking får føreren varsel med en gang.",
  },
  {
    question: "Kan systemet ettermonteres?",
    answer:
      "Ja. Vi leverer modelltilpassede kit for både nye og brukte maskiner. Ettermontering er særlig aktuelt på maskiner med høy belastning, mange smørepunkter eller varierende vedlikeholdsrutiner.",
  },
  {
    question: "Hvor driftssikkert er systemet?",
    answer:
      "Systemene er dimensjonert for krevende miljøer og kontinuerlig drift. Komponentene er robuste og tilpasset nordiske forhold. Elektronisk overvåking kan integreres for varsling ved avvik.",
  },
  {
    question: "Hva skjer dersom systemet får en feil?",
    answer:
      "Ved eventuelle avvik gir overvåkede systemer varsel tidlig. Uten overvåking vil systemet fortsatt være mekanisk robust og enkelt å feilsøke. Vi tilbyr rask support og reservedeler. Målet er alltid å minimere nedetid og sikre rask gjenoppretting.",
  },
];
