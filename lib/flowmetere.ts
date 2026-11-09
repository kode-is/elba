// Content for /flowmetere — flow meters and oil-lubrication monitoring from
// Kytola Instruments (Finland), which ELBA has sold, fitted and serviced in
// Norwegian process industry for over twenty years (customer folders on the
// company OneDrive go back to 2000: oil-circulation metering on paper
// machines, overhauls and replacements).
//
// Not scraped from the old Framer site. The copy is drawn from Kytola's own
// datasheets on the company OneDrive ("Leverandør ressurser/Kytola": SR1,
// 2950, VEx, V Smart, K Smart, KLD Smart, SLM, OILCOL and the "Lubrication oil
// flow monitoring in rolling mills" application note) and kytola.com's
// oil-circulation pages. Figures stay inside what those documents state;
// docs/handover.md lists the strings for Hlynur to review.
//
// Branding, as on /brannslukking: the page is ELBA's, in ELBA's red, white
// and black. Kytola is named as the manufacturer, but its blue and its logo
// are not used. Spelling follows Kytola's own usage — "Kytola" and "Kytola
// Instruments" in running text (no umlauts; "Kytölä" is the family name, not
// the brand), "KYTOLA®" as the registered mark — and product names are
// written exactly as in the datasheets: SR1, 2950, SRx, VEx, V Smart,
// K Smart, KLD Smart, OVAL D2, SLM, OILCOL.
export const KYTOLA_NAME = "Kytola Instruments";

/** The two measuring principles the demo and the comparison table set side by side. */
export type MeterKind = "va" | "oval";

export const METERS: Record<
  MeterKind,
  { label: string; summary: string; steps: { heading: string; text: string }[] }
> = {
  va: {
    label: "Variabelt areal",
    summary:
      "Oljen løfter et flottør i et konisk rør – jo mer olje, jo høyere står den. Enkelt, rimelig og lett å lese av på stedet, med induktive alarmgivere for lav og høy strøm.",
    steps: [
      {
        heading: "Kald oppstart",
        text: "Måleren er kalibrert for oljens viskositet ved driftstemperatur. Kald, tykk olje gir et avvik til oljen er varm.",
      },
      {
        heading: "I drift",
        text: "Flottøren står mellom alarmgrensene og viser strømmen til smørepunktet. Smart-modellene sender den videre som 4–20 mA.",
      },
      {
        heading: "Lav strøm – alarm",
        text: "Tetter ledningen seg, synker flottøren forbi lavalarmen. Giveren slår ut, og kontrollrommet får beskjed før lageret går tørt.",
      },
    ],
  },
  oval: {
    label: "Ovalhjul",
    summary:
      "To ovale tannhjul dreies av oljen og slipper gjennom et fast volum per omdreining. En sensor teller pulsene – målingen er den samme enten oljen er kald eller varm.",
    steps: [
      {
        heading: "Kald oppstart",
        text: "Ovalhjulsmåleren teller volum, ikke løft. Den viser riktig fra første minutt – i hele området 30–1000 cSt.",
      },
      {
        heading: "I drift",
        text: "Pulsene går til en KLD Smart eller OVAL D2, som viser strømmen for hvert smørepunkt og sammenligner den med alarmgrensene.",
      },
      {
        heading: "Lav strøm – alarm",
        text: "Faller strømmen under grensen, slår alarmreléet ut og meldingen går over Modbus til PLS eller DCS.",
      },
    ],
  },
};

export const COMPARISON: { feature: string; va: string; oval: string }[] = [
  { feature: "Måleprinsipp", va: "Flottør i konisk rør", oval: "Fast volum per omdreining" },
  { feature: "Påvirkes av viskositet", va: "Ja – kalibreres for driftsoljen", oval: "Nei – 30–1000 cSt" },
  { feature: "Avlesning på stedet", va: "Skala på røret", oval: "Gjennomsiktig deksel" },
  { feature: "Signal", va: "Alarmgiver, 4–20 mA (Smart)", oval: "Pulser til display" },
  { feature: "Service under drift", va: "Hurtigbytte av rør", oval: "Bypassventil" },
  { feature: "Passer best til", va: "Mange like punkter, vann og luft", oval: "Kritiske lagre og gir" },
];

export type Product = {
  name: string;
  kind: string;
  text: string;
  facts: string[];
  image: { src: string; alt: string; width: number; height: number };
};

// Product photos are Kytola's own, cut out from the datasheets (and the
// OVAL D2 shot from kytola.com) — public/images/flowmetere/.
export const PRODUCTS: Product[] = [
  {
    name: "SR1 og 2950",
    kind: "Ovalhjulsmålere for olje",
    text: "Utviklet for smøreolje i krevende industri. Gjennomsiktig deksel viser at oljen går, og pulsutgangen gir nøyaktig strøm uansett temperatur.",
    facts: ["Opptil 120 L/min (SR1) og 70 L/min (2950)", "30–1000 cSt", "Bypassventil for service under drift", "ATEX som tillegg"],
    image: { src: "/images/flowmetere/sr1.webp", alt: "Kytola SR1 ovalhjulsmåler med gjennomsiktig deksel", width: 184, height: 228 },
  },
  {
    name: "SRx målerblokk",
    kind: "Flere smørepunkter i én blokk",
    text: "Ovalhjulsmålere samlet i blokker for sentralsmøring med mange små punkter, ferdig til å henges ved siden av displayet.",
    facts: ["0,1–6 L/min per kanal", "KLD Smart kan monteres på blokken"],
    image: { src: "/images/flowmetere/srblokk.webp", alt: "Kytola SRx målerblokker for oljesmøring", width: 514, height: 421 },
  },
  {
    name: "KLD Smart",
    kind: "Berøringsskjerm, 1–8 kanaler",
    text: "Viser strøm og alarmer for hvert smørepunkt, med flere alarmnivåer og totalteller. Står alene eller kobles til styresystemet.",
    facts: ["Puls- eller mA-inngang", "Alarmrelé og 4–20 mA ut", "Modbus RTU og Modbus TCP", "IP65, stålkapsling"],
    image: { src: "/images/flowmetere/kld.webp", alt: "Kytola KLD Smart display med berøringsskjerm", width: 369, height: 533 },
  },
  {
    name: "OVAL D2",
    kind: "Målestasjon, opptil 64 kanaler",
    text: "For de store oljesentralene, som på papir- og kartongmaskiner. Overvåker hvert punkt med egne lav- og høyalarmer.",
    facts: ["1–64 målepunkter", "Lav- og høyalarm per punkt", "Modbus mot PLS eller DCS"],
    image: { src: "/images/flowmetere/oval-d2.webp", alt: "Kytola OVAL D2 målestasjon", width: 510, height: 391 },
  },
  {
    name: "VEx",
    kind: "Flerrørs flowmeter, variabelt areal",
    text: "1–7 rør i samme ramme, hvert med egen reguleringsventil. For smøreolje, tetnings- og kjølevann, spylevann og gass.",
    facts: ["Aluminium, AISI 316 eller polyamid", "Hurtigbytte av rør", "Klar for lavalarm"],
    image: { src: "/images/flowmetere/vex.webp", alt: "Kytola VEx flerrørs flowmeter med seks rør", width: 472, height: 461 },
  },
  {
    name: "V Smart og K Smart",
    kind: "Variabelt areal med 4–20 mA",
    text: "Flowmeter med innebygd transmitter og alarmlys: grønt innenfor grensene, gult ved høy og rødt ved lav strøm.",
    facts: ["4–20 mA, 3-leder", "Oppsett via USB-C", "Opptil 30 bar", "IP65"],
    image: { src: "/images/flowmetere/v-smart.webp", alt: "Kytola V Smart flowmeter med transmitter", width: 368, height: 904 },
  },
  {
    name: "SLM",
    kind: "Tetningsvann",
    text: "For pumper, omrørere og raffinører med akseltetning. Riktig mengde tetningsvann beskytter tetningen – uten å sende vann og energi rett i sluket.",
    facts: ["Tetteresistent reguleringsventil", "Innebygd rørrenser", "Alle modeller klare for alarm"],
    image: { src: "/images/flowmetere/slm.webp", alt: "Kytola SLM flowmeter for tetningsvann med trykkmåler", width: 307, height: 412 },
  },
];

/** The rest of the range, named so customers know to ask. */
export const MORE_PRODUCTS = [
  "Metallrørs flowmetere (MP)",
  "Akrylmålere (A, C, D, E og L)",
  "OILCOL oljefargeanalysator",
  "KVM Suite overvåkingsprogram",
  "Tilbakeslagsventiler",
  "Konstantstrømregulatorer",
];

export const INDUSTRIES: { heading: string; text: string }[] = [
  {
    heading: "Papir og kartong",
    text: "Sentral oljesmøring av valse- og sylinderlager i tørke- og våtparti – ofte hundrevis av punkter på samme maskin. Her har vi levert Kytola i over 20 år.",
  },
  {
    heading: "Valseverk og metall",
    text: "Varme, kalde og ferdigvalselinjer, og store girkasser. Ovalhjulsmålerne tåler forurenset olje og holder smøringen sikret.",
  },
  {
    heading: "Pumper og prosess",
    text: "Tetningsvann til pumper og raffinører, kjølevann og spylevann – vannsiden av den samme fabrikken.",
  },
];

export const PROCESS: { heading: string; text: string }[] = [
  {
    heading: "Kartlegging",
    text: "Vi går gjennom anlegget: antall smørepunkter, oljetype, viskositet, mengder og hvor alarmene skal gå.",
  },
  {
    heading: "Riktig måler",
    text: "Variabelt areal eller ovalhjul, materialer, tilkoblinger og display – valgt etter punktet, ikke etter katalogen.",
  },
  {
    heading: "Montering og oppsett",
    text: "Vi monterer, setter alarmgrensene og kobler målestasjonen til PLS eller DCS over Modbus.",
  },
  {
    heading: "Service og deler",
    text: "Overhaling, bytte av målere og reservedeler til eksisterende Kytola-anlegg – også de eldste.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Variabelt areal eller ovalhjul – hva skal vi velge?",
    answer:
      "Variabelt areal er enkelt og rimelig, og passer godt der mange like punkter skal vises på stedet. Ovalhjul måler volum og er uavhengig av viskositet og temperatur, og er det tryggeste valget for kritiske lagre og gir. Mange anlegg bruker begge.",
  },
  {
    question: "Kan målerne kobles til styresystemet vårt?",
    answer:
      "Ja. KLD Smart og OVAL D2 snakker Modbus RTU (RS-485), og Modbus TCP over Ethernet som tillegg. Smart-modellene med variabelt areal gir 4–20 mA, og alle displayene har alarmrelé.",
  },
  {
    question: "Vi har et eldre Kytola-anlegg. Kan dere hjelpe?",
    answer:
      "Ja. Vi har overhalt og byttet Kytola-målere i norske fabrikker i over 20 år, og skaffer deler også til eldre modeller. Ovalhjulsmålere med bypassventil kan tas ut til service uten å stoppe smøringen.",
  },
  {
    question: "Finnes det utførelser for eksplosjonsfarlige områder?",
    answer: "Ovalhjulsmålerne SR1 og 2950 kan leveres i ATEX-utførelse (II 2GD c TX).",
  },
  {
    question: "Måler dere bare olje?",
    answer:
      "Nei. Kytolas flowmetere med variabelt areal måler også vann, luft og andre gasser, og SLM er laget spesielt for tetningsvann til pumper og akseltetninger.",
  },
];
