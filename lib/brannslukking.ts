// Content for /brannslukking — automatic fire suppression from Protega
// Solutions, which ELBA now distributes and installs in Norway.
//
// Unlike the rest of the site this is not scraped from the old Framer site
// (the service did not exist there). The copy is drawn from ELBA's own
// Norwegian Protega material on the company OneDrive ("Leverandør ressurser/
// Protega/Salgsmateriale": the ELBA-branded sales brochures — General,
// Mining, Bus, Trucks, Port, Wind, CNC, Electrical cabinets — and Protega's
// sales training for ELBA). Claims stay inside what those documents state;
// docs/handover.md lists the strings for Hlynur to review.
//
// The customer-segment list deliberately mirrors the home page's industry
// strip (components/IndustryStrip.tsx) and reuses its icons: the training's
// "your unfair advantage" slide maps ELBA's lubrication segments onto
// Protega's target segments one for one, and that is the page's argument —
// the same customers, the same machines.

// The page is ELBA's, in ELBA's brand (red, white, black — the brand folder's
// "Logo Cheatsheet"): Protega is named as the manufacturer, but its gold, its
// hexagon and its logo are not used.
export const PROTEGA_NAME = "Protega Solutions";

/** ELBA brand-folder icons (components/BrandIcon.tsx). */
export const ICONS = {
  extinguisher: "/images/icons/brand/brannslukker.svg",
  extinguisherLarge: "/images/icons/brand/brannslukker-stor.svg",
  reliability: "/images/icons/brand/palitelighet.svg",
  quickService: "/images/icons/brand/rask-service.svg",
  professional: "/images/icons/brand/profesjonell.svg",
  expertise: "/images/icons/brand/teknisk-kompetanse.svg",
  sustainability: "/images/icons/brand/baerekraft.svg",
  innovation: "/images/icons/brand/innovasjon.svg",
  oil: "/images/icons/brand/olje.svg",
  components: "/images/icons/brand/komponenter.svg",
  technical: "/images/icons/brand/teknisk.svg",
} as const;

export type Segment = {
  name: string;
  /** Brand segment icon (public/images/icons/segments/). */
  icon: string;
  /** Card photo, from the ELBA brand folder ("Photos and Media", incl. "Our segments"). */
  photo: string;
  machines: string;
  protects: string;
};

export const SEGMENTS: Segment[] = [
  {
    name: "Anlegg",
    icon: "/images/icons/segments/anlegg.svg",
    photo: "/images/brannslukking/segmenter/anlegg.webp",
    machines: "Gravemaskiner, hjullastere, dumpere og borerigger",
    protects: "Motorrom, hydraulikk, turbo og eksos – der fett og olje møter varme flater.",
  },
  {
    name: "Landbruk",
    icon: "/images/icons/segments/landbruk.svg",
    photo: "/images/brannslukking/segmenter/landbruk.webp",
    machines: "Traktorer, høstemaskiner og selvgående redskap",
    protects: "Motorrom og hydraulikk, der halm og støv samler seg ved varme komponenter.",
  },
  {
    name: "Gjenvinning",
    icon: "/images/icons/segments/gjenvinning.svg",
    photo: "/images/brannslukking/segmenter/gjenvinning.webp",
    machines: "Kvernere, sorteringslinjer og materialhåndtering",
    protects: "Motorstyring, drivverk og hydraulikk – blant de mest brannutsatte maskinene som finnes.",
  },
  {
    name: "Sagbruk",
    icon: "/images/icons/segments/sagbruk.svg",
    photo: "/images/brannslukking/segmenter/sagbruk.webp",
    machines: "Tømmerhåndtering, flishuggere og filteranlegg",
    protects: "Motorrom, el-skap og filterskap i støvete, brennbare omgivelser.",
  },
  {
    name: "Maritim og offshore",
    icon: "/images/icons/segments/maritim.svg",
    photo: "/images/brannslukking/segmenter/maritim.webp",
    machines: "Fartøy, havnekraner og havneutstyr",
    protects: "Maskinrom, generatorer og el-tavler – også når fartøyet ligger ubemannet.",
  },
  {
    name: "Metall",
    icon: "/images/icons/segments/metall.svg",
    photo: "/images/brannslukking/segmenter/metall.webp",
    machines: "CNC-maskiner og maskineringssentre",
    protects: "Maskinrommet under ubemannet drift med høyt turtall, kjølevæske og olje.",
  },
  {
    name: "Papir og cellulose",
    icon: "/images/icons/segments/papir-cellulose.svg",
    photo: "/images/brannslukking/segmenter/papir-cellulose.webp",
    machines: "Prosessanlegg, el-skap og mobile maskiner",
    protects: "Elektriske skap, filterskap og hydraulikk som går døgnet rundt.",
  },
  {
    name: "Jernbane og transport",
    icon: "/images/icons/segments/jernbane.svg",
    photo: "/images/brannslukking/segmenter/transport.webp",
    machines: "Arbeidsmaskiner, busser og lastebiler",
    protects: "Motorrom, batteri og el-anlegg. R107-sertifisert for buss og ADR-kjøretøy.",
  },
];

export type Audience = { who: string; heading: string; text: string; points: string[] };

export const AUDIENCES: Audience[] = [
  {
    who: "Maskineier og entreprenør",
    heading: "Hold maskinen i drift",
    text: "En motorbrann kan bety uker uten maskin – eller at den må vrakes. Automatisk slukking stopper brannen før den får tak.",
    points: ["Sikkerhet for fører og folk rundt maskinen", "Dokumentert brannvern til forsikring og anbud", "Montert sammen med sentralsmøringen"],
  },
  {
    who: "Forhandler",
    heading: "Selg en komplett pakke",
    text: "Lever maskinen med smøresystem og brannslukking ferdig montert. Vi leverer modelltilpassede kit, eller monterer direkte hos sluttkunden.",
    points: ["Ferdige konfigurasjoner for vanlige maskiner", "Opplæring og sertifisering av egne teknikere", "Én leverandør for smøring og brannvern"],
  },
  {
    who: "Industri",
    heading: "Trygg ubemannet drift",
    text: "CNC-maskiner, el-skap og filteranlegg går ofte natt og helg uten folk til stede. Systemet vokter dem døgnet rundt.",
    points: ["Rene slukkemidler uten rester på elektronikk", "Kort opprydding – produksjonen er raskt i gang", "Servicekontrakt med inspeksjonssertifikat"],
  },
];

/** Flashpoint and autoignition temperature, °C — Protega's sales training for ELBA. */
export const FLUIDS = [
  { name: "Diesel", flashpoint: 55, autoignition: 225 },
  { name: "Motorolje", flashpoint: 205, autoignition: 315 },
  { name: "Girolje", flashpoint: 200, autoignition: 390 },
];

export const RISK_ZONES = ["Motorrom", "Elektrisk anlegg", "Drivstofftank", "Hydraulikk", "Batterier", "Turbo og eksos"];

export type SystemKind = "direkte" | "indirekte";

export const SYSTEMS: Record<
  SystemKind,
  { label: string; summary: string; steps: { heading: string; text: string }[]; bestFor: string[] }
> = {
  direkte: {
    label: "Direkte system",
    summary: "Deteksjonsrøret er både føler og utløp. Enkelt, få deler – best i mindre, lukkede rom.",
    steps: [
      { heading: "Overvåker", text: "Et trykksatt polymerrør går gjennom risikosonen og kjenner etter varme hele tiden." },
      { heading: "Sprekker", text: "Når flammen treffer røret, sprekker det, og trykket faller momentant." },
      { heading: "Slukker", text: "Slukkemiddelet strømmer ut gjennom åpningen – akkurat der brannen er." },
    ],
    bestFor: ["El-skap og tavler", "CNC-maskiner", "Ladestasjoner", "Kabelbroer og serverrack"],
  },
  indirekte: {
    label: "Indirekte system",
    summary: "Røret oppdager brannen, dyser fordeler middelet. Størst slukkekraft og full kontroll på dekningen.",
    steps: [
      { heading: "Overvåker", text: "Det samme deteksjonsrøret følger risikosonene i motorrommet." },
      { heading: "Utløser", text: "Når røret sprekker, åpner trykkfallet ventilen på toppen av sylinderen." },
      { heading: "Slukker", text: "Middelet fordeles gjennom dyser rettet mot hvert enkelt risikopunkt." },
    ],
    bestFor: ["Motorrom på anleggsmaskiner", "Hydraulikk og drivverk", "Busser og lastebiler", "Større CNC-maskiner"],
  },
};

export const AGENTS = [
  {
    name: "ABC-pulver",
    text: "Protegas standard for kjøretøy, maskiner og industri, for brannklasse A, B og C. Slår ned flammene raskt, tåler frost og vær og er ikke-ledende og ikke-etsende.",
  },
  {
    name: "Rent slukkemiddel (FK-5-1-12)",
    text: "Lagres flytende og utløses som gass, og etterlater ingen rester. Ikke-ledende og uten ozonnedbrytende potensial – riktig for el-skap, CNC og elektronikk.",
  },
  {
    name: "Fluorfritt skum",
    text: "PFAS-fritt. Legger en film over drivstoffet som kveler brannen og hindrer gjenantenning – et miljøtilpasset valg for væskebranner.",
  },
];

/** Protega vs. a handheld extinguisher vs. a sprinkler — Protega's sales training. */
export const COMPARISON: { feature: string; protega: boolean; handheld: boolean; sprinkler: boolean }[] = [
  { feature: "Virker uten at noen er til stede", protega: true, handheld: false, sprinkler: true },
  { feature: "Kan stoppe motoren automatisk", protega: true, handheld: false, sprinkler: false },
  { feature: "Slukker lokalt, ved kilden", protega: true, handheld: true, sprinkler: false },
  { feature: "Utløses ved første tegn til brann", protega: true, handheld: true, sprinkler: false },
  { feature: "Ingen vannskader", protega: true, handheld: true, sprinkler: false },
  { feature: "Beskytter døgnet rundt", protega: true, handheld: false, sprinkler: true },
];

export const REASONS = [
  { icon: ICONS.technical, heading: "Helautomatisk og mekanisk", text: "Ingen strøm, batteri eller programvare trengs for å utløse." },
  { icon: ICONS.reliability, heading: "Nesten ingen falske utløsninger", text: "Et deteksjonsrør laget for formålet, og utprøvd i felt." },
  { icon: ICONS.professional, heading: "Bygget for krevende miljøer", text: "Kompakt og robust, utviklet for 10 års driftslevetid." },
  { icon: ICONS.components, heading: "Enkel ettermontering", text: "Passer både nye maskiner og maskinene du allerede har." },
  { icon: ICONS.sustainability, heading: "Lav totalkostnad", text: "Lite vedlikehold og lang levetid – og langt billigere enn én brann." },
  { icon: ICONS.expertise, heading: "Sertifisert", text: "CE-merket, R107-godkjent for buss og ADR-kjøretøy, og ISO 9001-sertifisert produksjon." },
];

export const OPTIONS = ["Varsling i førerhytta", "Manuell utløsning", "Automatisk motorstopp", "Varsellys og sirene"];

export const PROCESS = [
  {
    heading: "Kartlegging",
    text: "Vi ser på maskinen sammen med deg og finner risikosonene: motorrom, el-anlegg, drivstoff og hydraulikk.",
  },
  {
    heading: "Tilbud",
    text: "For mange vanlige maskiner finnes ferdige konfigurasjoner, så du får pris raskt. Spesialmaskiner dimensjoneres av Protega.",
  },
  {
    heading: "Montering",
    text: "Våre egne montører installerer – gjerne i samme verkstedbesøk som sentralsmøringen. Du får opplæring og full dokumentasjon.",
  },
  {
    heading: "Service og sertifikat",
    text: "Inspeksjon hver sjette eller tolvte måned, med inspeksjonssertifikat. Sylindrene trykktestes hvert tiende år.",
  },
];

// Photos not already used higher up the page (hero, tiles, collage).
export const GALLERY = [
  { src: "/images/brannslukking/motorrom-ror.webp", width: 1200, height: 1600, caption: "Deteksjonsrør i motorrom" },
  { src: "/images/brannslukking/buss.webp", width: 1400, height: 1493, caption: "Buss" },
  { src: "/images/brannslukking/baat.webp", width: 1400, height: 933, caption: "Fartøy" },
  { src: "/images/brannslukking/hjullaster-motorrom.webp", width: 1200, height: 1600, caption: "Sylinder i motorrom på hjullaster" },
  { src: "/images/brannslukking/sylinder-etikett.webp", width: 1200, height: 900, caption: "Sylinder montert i brakett" },
];

export const FAQ_ITEMS = [
  {
    question: "Kan systemet ettermonteres på maskinene vi allerede har?",
    answer:
      "Ja. Protega passer både nye og brukte maskiner, og ettermontering er det vanligste. Mange maskiner har ferdige konfigurasjoner, slik at sylinderstørrelse, antall dyser og lengde på deteksjonsrøret allerede er bestemt.",
  },
  {
    question: "Trenger systemet strøm eller batteri for å virke?",
    answer:
      "Nei. Både det direkte og det indirekte systemet utløses helt mekanisk av trykkfallet i deteksjonsrøret. Varsling i førerhytta, manuell utløsning, motorstopp og varsellys med sirene kan kobles til som tillegg.",
  },
  {
    question: "Kan det monteres samtidig med sentralsmøring?",
    answer:
      "Ja, og det er ofte det smarteste. Maskinen står allerede inne hos oss eller forhandleren, og våre montører kjenner den fra før. Du sparer et ekstra verkstedbesøk og en ekstra dag uten maskin.",
  },
  {
    question: "Hvilket slukkemiddel bør vi velge?",
    answer:
      "ABC-pulver er standard for kjøretøy og anleggsmaskiner. Rent slukkemiddel (FK-5-1-12) passer der det ikke skal bli rester, som i el-skap og CNC-maskiner. Bearbeider dere magnesium, aluminium eller titan som spon eller støv, trengs et eget D-pulver – vi hjelper dere å velge riktig.",
  },
  {
    question: "Hvor ofte må systemet kontrolleres?",
    answer:
      "Vi anbefaler inspeksjon hver sjette eller tolvte måned, avhengig av bruken. Etter hver inspeksjon får du et sertifikat som dokumenterer at systemet er i orden. Sylindrene trykktestes hvert tiende år.",
  },
  {
    question: "Hva koster det?",
    answer:
      "Det avhenger av maskinen og hvor mange risikosoner som skal beskyttes. Send oss maskintype og modell, så kommer vi raskt tilbake med pris. Sammenlign gjerne med hva én brann koster: maskinen, ukene uten den, og egenandelen.",
  },
];
