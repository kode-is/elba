// Brand partners. id, name, href, site (external URL) and the brand-strip
// logo path are sourced from docs/scrape/home.json (blocks 8-13, the marquee
// logos) and cross-checked against docs/scrape/vorumerki.json. `cardImage` is
// the larger wordmark/logo shown on the /vorumerki index
// (docs/scrape/vorumerki.json), which differs from the brand-strip `logo`
// crop for every brand.
//
// Task 8 additionally extends every record with the /vorumerki/[slug] page
// content, sourced verbatim from docs/scrape/vorumerki__<id>.json: `title`
// (scraped <title>), `description` (scraped <meta description> — identical
// across all six), `body` (the page's `text` blocks, in scrape order,
// reshaped into paragraph/list blocks per the "list"/"bold" annotations
// added to the scrape JSON — see docs/scrape/formatting.json) and `image`
// (the single "content"-role image on the page, used as the title band's
// background). `subheading` covers BMair's only H4 lead-in line — no other
// brand has one. `site` is kept for reference/future use but the live
// brand pages don't render it, so /vorumerki/[slug]/page.tsx doesn't
// either.

import type { Img } from "./types";

/**
 * One rendered block of a brand page's body copy, built from the scrape's
 * `text` blocks: consecutive `text` blocks sharing the same `list` index
 * collapse into one `{ type: "list" }` block (rendered `<ul>`, matching the
 * live bulleted list — see BMair); a `text` block with `bold: true` becomes
 * a `{ type: "p", bold: true }` block (rendered with heavier weight,
 * matching the live page's single bold paragraph on um-beka/pebe/
 * lilleseth-kjetting).
 */
export type BrandBlock =
  | { type: "p"; text: string; bold?: true }
  | { type: "list"; items: string[] };

export type Brand = {
  id: string;
  name: string;
  href: `/vorumerki/${string}`;
  site: string;
  /** Brand-strip marquee logo, from public/images/home. */
  logo: string;
  /** Larger logo/wordmark shown on the /vorumerki index cards. */
  cardImage?: Img;
  blurb?: string;
  /** Scraped <title> for /vorumerki/[slug], e.g. "Gigant — Skralli". */
  title: string;
  /** Scraped <meta description> for /vorumerki/[slug]. */
  description: string;
  /** BMair-only H4 lead-in line, rendered above `body`. */
  subheading?: string;
  /** Body copy, verbatim text, reshaped into paragraph/list blocks. */
  body: BrandBlock[];
  /** The page's single content image (title band background). */
  image: Img;
};

const DESCRIPTION = "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.";

export const brands: Brand[] = [
  {
    id: "gigant",
    name: "Gigant",
    href: "/vorumerki/gigant",
    site: "https://gigantprodukter.no/",
    logo: "/images/home/02-3e0cd936.svg",
    cardImage: { src: "/images/vorumerki/06-4fb3378a.png", alt: "", width: 386, height: 386 },
    title: "Gigant — Skralli",
    description: DESCRIPTION,
    image: {
      src: "/images/vorumerki__gigant/01-04305ffd.jpg",
      alt: "Gigant",
      width: 512,
      height: 341,
    },
    body: [
      {
        type: "p",
        text: "Gigant sérhæfir sig í framleiðslu á hágæða sturtuvögnum og vetrarbúnaði fyrir verktaka og bændur. Þessi norska hönnun hefur í mörg ár verið meðal söluhæstu sturtuvagna í Noregi og ekki af ástæðulausu. Skralli hefur nú þegar afhent 30 vagna á síðastliðnum tveimur árum og hafa þeir reynst afar vel við íslenskar aðstæður.",
      },
      {
        type: "p",
        text: "Gigant býður einnig upp á fjölbreytta vetrarlínu sem mætir öllum kröfum sem íslenski veturinn felur í sér, eins og fjölplóga fyrir snjómokstur, skerastál, sanddreyfara og ís- og veghefla aftan í dráttarvélar.",
      },
    ],
  },
  {
    id: "hammerglass",
    name: "Hammerglass",
    href: "/vorumerki/hammerglass",
    site: "https://www.hammerglass.com/",
    logo: "/images/home/03-288ddb43.svg",
    cardImage: {
      src: "/images/home/30-51b0fe1c.png",
      alt: "Hammerglass",
      width: 386,
      height: 300,
    },
    title: "Hammerglass — Skralli",
    description: DESCRIPTION,
    // Reuses the home page's category image (docs/scrape/home.json) —
    // confirmed by both the scrape's "local" path and the reference
    // screenshot; there's no separate Hammerglass-specific content photo.
    image: {
      src: "/images/home/24-a996c2c4.jpg",
      alt: "Hammerglass",
      width: 512,
      height: 384,
    },
    body: [
      {
        type: "p",
        text: "Hammerglass er leiðandi sænskur framleiðandi í öryggislausnum með hugverkaverndaðri tækni og framleiðir óbrjótanlegar og eldhamlandi rúður sem þola erfiðustu aðstæður. Skralli býður upp á sérhannaðar öryggislausnir fyrir sveitarfélög og verktaka, þar sem sérstök áhersla er lögð á sprengjuheldar, grjótheldar og rispuþolnar rúður. Lausnirnar eru fullkomnar fyrir strætóskýli, hljóðmúra og aðra opinbera staði þar sem skemmdarverk geta valdið óþarfa kostnaði og viðhaldi.",
      },
      // "stóiðnaði" (missing "r") is a typo on the live site — kept verbatim.
      {
        type: "p",
        text: "Hammerglass rúður eru 300 sinnum sterkari en venjulegt gler og bjóða upp á lengri endingartíma, UV-vörn og lágmarks viðhald. Rúðurnar hafa sannað sig í stóiðnaði og á byggingarsvæðum þar sem mikil hætta er á grjóthruni eða þar sem sprengiefni eru notuð til þess að tryggja bæði mannslíf og búnað.",
      },
      {
        type: "p",
        text: "Skralli býður íslenskum sveitarfélögum, verktökum og fyrirtækjum úrval lausna frá Hammerglass óbrjótanlegt öryggi í samgöngumannvirkjum, ökutækjum og byggingum. Með Hammerglass færðu öruggar og endingargóðar rúður sem henta við íslenskar aðstæður og veita hámarks vernd gegn utanaðkomandi hættum.",
      },
    ],
  },
  {
    id: "um-beka",
    name: "Groeneveld-BEKA",
    href: "/vorumerki/um-beka",
    site: "https://www.groeneveld-beka.com/en/",
    logo: "/images/home/04-6904d068.png",
    cardImage: {
      src: "/images/home/31-8e2b1073.svg",
      alt: "Groenevald-BEKA logo",
      width: 264,
      height: 288,
    },
    title: "Groeneveld-BEKA — Skralli",
    description: DESCRIPTION,
    image: {
      src: "/images/vorumerki__um-beka/01-497cd467.jpeg",
      alt: "Groeneveld-BEKA",
      width: 512,
      height: 683,
    },
    body: [
      {
        type: "p",
        text: "Skralli býður upp á alhliða lausnir fyrir sjálfvirk smurkerfi frá Groeneveld-BEKA, hönnuð fyrir vélar, iðnað og allt sem þarfnast reglubundinnar smurningar. Sjálfvirkt smurkerfi tryggir rétta smurningu með réttu magni í alla smurpunkta.",
      },
      {
        type: "p",
        text: "Skralli er eina fyrirtækið á Íslandi sem sérhæfir sig í þjónustu og viðgerðum á smurkerfum og býður upp á breitt úrval af varahlutum. Teymið býr yfir yfirgripsmikilli þekkingu og áralangri reynslu í smurkerfum. Við vinnum þétt með okkar framleiðendum sem tryggir hágæða lausnir og skjótri afgreiðslu. Við erum með vel útbúna þjónustubíla og tökum að okkur verkefni um land allt.",
      },
      { type: "p", text: "Við gerum föst tilboð í allar uppsetningar - hvar sem er á landinu." },
      {
        type: "p",
        bold: true,
        text: "Skralli mælir með MAX-2-LUBE koppafeiti í öll smurkerfi. Koppafeitin hefur einstaklega mikla viðloðun og seigju og er sérlega hentug fyrir kröfur íslensks iðnaðar.",
      },
    ],
  },
  {
    id: "lilleseth-kjetting",
    name: "Lilleseth",
    href: "/vorumerki/lilleseth-kjetting",
    site: "https://www.lilleseth.no/",
    logo: "/images/home/05-17eb54cf.png",
    cardImage: {
      src: "/images/home/32-4354a44e.png",
      alt: "Lilleseth Kjetting",
      width: 386,
      height: 264,
    },
    title: "Lilleseth — Skralli",
    description: DESCRIPTION,
    image: {
      src: "/images/vorumerki__lilleseth-kjetting/01-e84535d7.png",
      alt: "Lilleseth",
      width: 415,
      height: 512,
    },
    body: [
      {
        type: "p",
        text: "Lilleseth er traust og rótgróið norskt fjölskyldufyrirtæki með yfir 75 ára reynslu í snjókeðjum ásamt því að bjóða upp á vottaðan hífi- og festibúnað fyrir iðnað og flutninga.",
      },
      {
        type: "p",
        text: "Snjókeðjurnar frá Lilleseth eru fáanlegar fyrir landbúnað, vinnuvélar og bíla (s.s. vörubíla, strætisvagna, rútur og flutningabíla). Með fjölbreyttum valkostum af keðjum með mörgum útfærslum brodda tryggir Lilleseth hámarks grip, endingu og öryggi við krefjandi vetraraðstæður.",
      },
      {
        type: "p",
        text: "Fyrir þá sem þurfa á hífibúnaði og festibúnaði að halda, býður Lilleseth upp á vottaðar lausnir sem henta sérstaklega vel til notkunar á byggingarsvæðum eða í kringum fólk, þar sem öryggi er lykilatriði.",
      },
      {
        type: "p",
        text: "Vörurnar hafa verið prófaðar við ströngustu aðstæður og uppfylla öll skilyrði um öryggi og endingu. Snjókeðjurnar eru einstaklega endingargóðar og mæta öllum þörfum sem íslenskir notendur kunna að hafa, hvort sem er við snjómokstur, landflutninga, landbúnað eða vinnuvélar.",
      },
      {
        type: "p",
        bold: true,
        text: "Með breiðasta úrvalið af snjókeðjum í Noregi, vottaðan hífi- og festibúnað og norska hönnun sem stenst tímans tönn er Lilleseth það merki sem þú getur treyst á.",
      },
    ],
  },
  {
    id: "pebe",
    name: "Pebe",
    href: "/vorumerki/pebe",
    site: "https://www.pebe.se/en/home",
    logo: "/images/home/06-79588ec3.svg",
    cardImage: { src: "/images/vorumerki/07-e213d0ba.png", alt: "", width: 386, height: 272 },
    title: "Pebe — Skralli",
    description: DESCRIPTION,
    image: {
      src: "/images/vorumerki__pebe/01-1afdf64e.jpeg",
      alt: "Pebe",
      width: 512,
      height: 271,
    },
    body: [
      {
        type: "p",
        text: "PeBe er sænskur framleiðandi sem sérhæfir sig í hágæða sætisáklæðum og gólfmottum fyrir vinnuvélar, vörubíla og atvinnubíla. Lausnirnar eru sérsaumaðar fyrir hvern framleiðanda, sem tryggir fullkomið snið aðlagað að hverju ökutæki. Vörurnar eru úr slitsterku efni sem þolir mikla notkun og veitir bæði þægindi og stílhreint útlit.",
      },
      {
        type: "p",
        text: "Skralli býður upp á fjölbreytt úrval af sætisáklæðum og gólfmottum fyrir þá sem vilja endingargóðar og stílhreinar lausnir fyrir sínar vinnuvélar, vörubíla eða atvinnubíla. Hafðu samband og við finnum réttu lausnina fyrir þig!",
      },
      {
        type: "p",
        bold: true,
        text: "Skralli hefur einnig þróað skóbakka í samtarfi við PeBe. Bakkarnir eru úr þykku gúmmíi með kanti og eru tilvaldir fyrir ökumanninn vill halda skrifstofunni hreinni.",
      },
    ],
  },
  {
    id: "bmair",
    name: "BMair",
    href: "/vorumerki/bmair",
    site: "https://www.bmair.com/",
    logo: "/images/home/07-882f4f17.svg",
    cardImage: { src: "/images/vorumerki/02-949edfd3.png", alt: "", width: 386, height: 272 },
    title: "BMair — Skralli",
    description: DESCRIPTION,
    image: {
      src: "/images/vorumerki__bmair/01-13900342.jpg",
      alt: "BMair",
      width: 512,
      height: 384,
    },
    subheading:
      "BMair er markaðsleiðandi framleiðandi af lofthreinsitækjum fyrir stjórnenda vinnuvéla í Evrópu.",
    body: [
      {
        type: "p",
        text: "Skralli býður sínum viðskiptavinum nýjustu tækni í þessum geira fyrir bætt vinnuumhverfi af öllu tagi, svosem:",
      },
      {
        type: "list",
        items: [
          "Endurvinnslu",
          "Jarðgerð",
          "Demolition / Niðurrif bygginga",
          "Flutning og geymslu efna",
          "Námuvinnslu",
        ],
      },
    ],
  },
];
