// GENERATED FILE — do not edit by hand.
// Run `npm run gen-hifi` (scripts/gen-hifi.mjs) to regenerate from
// docs/scrape/hifi-festibunadur__*.json (8 sub-page files) and
// docs/scrape/tables.json. See that script for the parsing rules. The
// /hifi-festibunadur index page itself is not generated here — its content
// lives directly in app/hifi-festibunadur/page.tsx.

import type { Img } from "./types";

export type HifiBlock =
  | {
      type: "heading";
      level: number;
      text: string;
      /** Min/max endpoint labels of the live page's range-slider widget for
       * this heading (see RANGE_LABELS in scripts/gen-hifi.mjs) — present
       * only on the handful of "… í boði" / "(WLL)" headings that have one. */
      range?: { min: string; max: string };
    }
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

/** A product-spec table (docs/scrape/tables.json), keyed to the heading
 * (H2 or H3) it sits under in `blocks`. `images`, when present, are the
 * product photo(s) shown alongside this table on the live page (aukabunadur's
 * five tables and bordastrekkjarar's own table all have one; the others don't). */
export type HifiTable = {
  heading: string;
  headers: string[];
  rows: string[][];
  images?: Img[];
};

export type HifiPage = {
  id: string;
  /** Route segments after /hifi-festibunadur/, e.g. ["stroffur","hringstroffur"]. */
  path: string[];
  /** H1 / display title. */
  title: string;
  /** H1 subtitle line — hifikedjur, bindikedjur-strekkjarar, aukabunadur only. */
  subtitle?: string;
  /** Scraped <meta description> (the <title> is site-wide, set directly by the page). */
  description: string;
  heroImage?: Img;
  /** Body content (verbatim), excluding the H1, breadcrumb, table cells and ContactCta blocks. */
  blocks: HifiBlock[];
  /** Content images (verbatim, in order), excluding the hero image. */
  images: Img[];
  tables?: HifiTable[];
  /** Slugs of child pages (stroffur only), in on-page card order. */
  children?: string[];
};

export const hifiPages: HifiPage[] = [
  {
    "id": "aukabunadur",
    "path": [
      "aukabunadur"
    ],
    "title": "Aukabúnaður til hífinga",
    "subtitle": "Vottaður aukabúnaður fyrir hífingar af öllum stærðum og gerðum.",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur/05-865d4540.jpg",
      "alt": "",
      "width": 1439,
      "height": 507
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Ýmislegt"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "LR9608K - Tromluakkeri"
      },
      {
        "type": "text",
        "text": "2.0 tonn"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "LR9613K - Tromluakkeri"
      },
      {
        "type": "text",
        "text": "5.3 tonn"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "FAT1T - Tunnukeðja"
      },
      {
        "type": "text",
        "text": "1.0 tonn"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Keðjutalíur"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "H-lás"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Öryggiskrókur"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Kranakrókur lokaður"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Ásuðukrókur"
      }
    ],
    "images": [
      {
        "src": "/images/hifi-festibunadur__aukabunadur/02-6d00818a.jpg",
        "alt": "",
        "width": 350,
        "height": 350
      },
      {
        "src": "/images/hifi-festibunadur__aukabunadur/02-6d00818a.jpg",
        "alt": "",
        "width": 350,
        "height": 350
      },
      {
        "src": "/images/hifi-festibunadur__aukabunadur/04-d6d4c255.png",
        "alt": "",
        "width": 540,
        "height": 190
      },
      {
        "src": "/images/hifi-festibunadur__aukabunadur/05-266d3aa9.png",
        "alt": "",
        "width": 540,
        "height": 190
      },
      {
        "src": "/images/hifi-festibunadur__aukabunadur/06-4ffc22e3.png",
        "alt": "",
        "width": 540,
        "height": 540
      },
      {
        "src": "/images/hifi-festibunadur__aukabunadur/07-c8a42628.png",
        "alt": "",
        "width": 540,
        "height": 540
      },
      {
        "src": "/images/hifi-festibunadur__aukabunadur/08-f55806ee.png",
        "alt": "",
        "width": 540,
        "height": 540
      }
    ],
    "tables": [
      {
        "heading": "Keðjutalíur",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "Burðargeta",
          "Lengd"
        ],
        "rows": [
          [
            "TAJ 0,25",
            "Keðjutalía",
            "0,25t",
            "1,5m"
          ],
          [
            "TAJ 0,75",
            "Keðjutalía",
            "0,75t",
            "1,5m"
          ],
          [
            "TAJ 1,5",
            "Keðjutalía",
            "1,5t",
            "1,5m"
          ],
          [
            "TAJ 3,0",
            "Keðjutalía",
            "3,0t",
            "1,5m"
          ]
        ],
        "images": [
          {
            "src": "/images/hifi-festibunadur__aukabunadur/04-d6d4c255.png",
            "alt": "",
            "width": 540,
            "height": 190
          }
        ]
      },
      {
        "heading": "H-lás",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "LVÁ/WLL"
        ],
        "rows": [
          [
            "DGSL07",
            "D-lás 7mm",
            "0,5t"
          ],
          [
            "DGSL09",
            "D-lás 9mm",
            "0,75t"
          ],
          [
            "DGSL10",
            "D-lás 10mm",
            "1,0t"
          ],
          [
            "DGSL11",
            "D-lás 11mm",
            "1,5t"
          ],
          [
            "DGSL13",
            "D-lás 13mm",
            "2,0t"
          ],
          [
            "DGSL16",
            "D-lás 16mm",
            "3,25t"
          ],
          [
            "DGSL19",
            "D-lás 19mm",
            "4,75t"
          ],
          [
            "DGSL22",
            "D-lás 22mm",
            "6,5t"
          ],
          [
            "DGSL25",
            "D-lás 25mm",
            "8,5t"
          ],
          [
            "DGSL28",
            "D-lás 28mm",
            "9,5t"
          ]
        ],
        "images": [
          {
            "src": "/images/hifi-festibunadur__aukabunadur/05-266d3aa9.png",
            "alt": "",
            "width": 540,
            "height": 190
          }
        ]
      },
      {
        "heading": "Öryggiskrókur",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "Burðarþol"
        ],
        "rows": [
          [
            "10000600",
            "KROK SIKKERHETSKROK G80 SLK7/8 M/GAFFEL",
            "2t"
          ],
          [
            "10000602",
            "KROK SIKKERHETSKROK G80 SLK10 M/GAFFEL",
            "3,15t"
          ],
          [
            "10000603",
            "KROK SIKKERHETSKROK G80 SLK13 M/GAFFEL",
            "5,4t"
          ],
          [
            "10000604",
            "KROK SIKKERHETSKROK G80 SLK16 M/GAFFEL",
            "8,0t"
          ],
          [
            "10000700",
            "KROK SIKKERHETSKROK G100 SLK7/8 M/GAFFEL",
            "2,5t"
          ],
          [
            "10000702",
            "KROK SIKKERHETSKROK G100 SLK10 M/GAFFEL",
            "4,0t"
          ],
          [
            "10000703",
            "KROK SIKKERHETSKROK G100 SLK13 M/GAFFEL",
            "6,7t"
          ],
          [
            "10000704",
            "KROK SIKKERHETSKROK G100 SLK16 M/GAFFEL",
            "10t"
          ]
        ],
        "images": [
          {
            "src": "/images/hifi-festibunadur__aukabunadur/06-4ffc22e3.png",
            "alt": "",
            "width": 540,
            "height": 540
          }
        ]
      },
      {
        "heading": "Kranakrókur lokaður",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "Burðarþol"
        ],
        "rows": [
          [
            "10000610",
            "KROK G80 CSK6 M/LEPPE-GAFFEL",
            "1,12t"
          ],
          [
            "10000630",
            "KROK G80 CSK7-8 M/LEPPE-GAFFEL",
            "2t"
          ],
          [
            "10000632",
            "KROK G80 CSK10 M/LEPPE-GAFFEL",
            "3,15t"
          ],
          [
            "10000634",
            "KROK G80 CSK13 M/LEPPE-GAFFEL",
            "5,4t"
          ],
          [
            "10000635",
            "KROK G80 CSK16 M/LEPPE-GAFFEL",
            "8,0t"
          ],
          [
            "10000730",
            "KROK G100 CSK7-8 M/LEPPE-GAFFEL",
            "2,5t"
          ],
          [
            "10000732",
            "KROK G100 CSK10 M/LEPPE-GAFFEL",
            "4,0t"
          ],
          [
            "10000734",
            "KROK G100 CSK13 M/LEPPE-GAFFEL",
            "6,7t"
          ]
        ],
        "images": [
          {
            "src": "/images/hifi-festibunadur__aukabunadur/07-c8a42628.png",
            "alt": "",
            "width": 540,
            "height": 540
          }
        ]
      },
      {
        "heading": "Ásuðukrókur",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "Burðarþol"
        ],
        "rows": [
          [
            "UGK2",
            "Ásuðukrókur",
            "2t"
          ],
          [
            "UGK3",
            "Ásuðukrókur",
            "3t"
          ],
          [
            "UGK5",
            "Ásuðukrókur",
            "5t"
          ],
          [
            "UGK8",
            "Ásuðukrókur",
            "8t"
          ],
          [
            "UGK10",
            "Ásuðukrókur",
            "10t"
          ],
          [
            "UGK20",
            "Ásuðukrókur",
            "20t"
          ]
        ],
        "images": [
          {
            "src": "/images/hifi-festibunadur__aukabunadur/08-f55806ee.png",
            "alt": "",
            "width": 540,
            "height": 540
          }
        ]
      }
    ]
  },
  {
    "id": "bindikedjur-strekkjarar",
    "path": [
      "bindikedjur-strekkjarar"
    ],
    "title": "Bindikeðjur og strekkjarar",
    "subtitle": "Vottaðar bindikeðjur og strekkjarar fyrir örugga festingu á farmi",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur/04-dd0c6f76.png",
      "alt": "",
      "width": 1440,
      "height": 1407
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Keðjustrekkjarar"
      },
      {
        "type": "text",
        "text": "Mikið úrval af keðjustrekkjurum til á lager. Fást bæði með og án læsingu í krókum."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Þyngdarþol í boði",
        "range": {
          "min": "4 tonn",
          "max": "21 tonn"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Stærðir í boði",
        "range": {
          "min": "6 mm",
          "max": "16 mm"
        }
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Bindikeðjur"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Grade 80"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Grade 100"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Grade 120"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Breidd í boði",
        "range": {
          "min": "6 mm",
          "max": "13 mm"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Lengd í boði",
        "range": {
          "min": "2 metrar",
          "max": "6 metrar"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Leyfilegt vinnuálag (WLL)",
        "range": {
          "min": "4.0 tonn",
          "max": "21.6 tonn"
        }
      }
    ],
    "images": [],
    "tables": [
      {
        "heading": "Leyfilegt vinnuálag (WLL)",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "LVÁ (WLL)",
          "Lengd"
        ],
        "rows": [
          [
            "LR950822",
            "G80 2-part (8mm)",
            "2,8t",
            "3 metrar"
          ],
          [
            "LR950823",
            "G80 2-part (8mm)",
            "2,8t",
            "4 metrar"
          ],
          [
            "LR950824",
            "G80 2-part (8mm)",
            "2,8t",
            "5 metrar"
          ],
          [
            "LR950825",
            "G80 2-part (8mm)",
            "2,8t",
            "6 metrar"
          ],
          [
            "LR950826",
            "G80 2-part (10mm)",
            "4,25t",
            "2 metrar"
          ],
          [
            "LR951022",
            "G80 2-part (10mm)",
            "4,25t",
            "3 metrar"
          ],
          [
            "LR951023",
            "G80 2-part (10mm)",
            "4,25t",
            "4 metrar"
          ],
          [
            "LR951024",
            "G80 2-part (10mm)",
            "4,25t",
            "5 metrar"
          ],
          [
            "LR951025",
            "G80 2-part (10mm)",
            "4,25t",
            "6 metrar"
          ],
          [
            "LR951026",
            "G80 2-part (13mm)",
            "7,5t",
            "2 metrar"
          ],
          [
            "LR951322",
            "G80 2-part (13mm)",
            "7,5t",
            "3 metrar"
          ],
          [
            "LR951323",
            "G80 2-part (13mm)",
            "7,5t",
            "4 metrar"
          ],
          [
            "LR951324",
            "G80 2-part (13mm)",
            "7,5t",
            "5 metrar"
          ],
          [
            "LR951325",
            "G80 2-part (13mm)",
            "7,5t",
            "6 metrar"
          ],
          [
            "LR960822",
            "G100 2-part (8mm)",
            "3,55t",
            "3 metrar"
          ],
          [
            "LR960823",
            "G100 2-part (8mm)",
            "3,55t",
            "4 metrar"
          ],
          [
            "LR960824",
            "G100 2-part (8mm)",
            "3,55t",
            "5 metrar"
          ],
          [
            "LR960825",
            "G100 2-part (8mm)",
            "3,55t",
            "6 metrar"
          ],
          [
            "LR960826",
            "G100 2-part (10mm)",
            "5,6t",
            "2 metrar"
          ],
          [
            "LR961022",
            "G100 2-part (10mm)",
            "5,6t",
            "3 metrar"
          ],
          [
            "LR961023",
            "G100 2-part (10mm)",
            "5,6t",
            "4 metrar"
          ],
          [
            "LR961024",
            "G100 2-part (10mm)",
            "5,6t",
            "5 metrar"
          ],
          [
            "LR961025",
            "G100 2-part (10mm)",
            "5,6t",
            "6 metrar"
          ],
          [
            "LR961026",
            "G100 2-part (13mm)",
            "9,5t",
            "2 metrar"
          ],
          [
            "LR961322",
            "G100 2-part (13mm)",
            "9,5t",
            "3 metrar"
          ],
          [
            "LR961323",
            "G100 2-part (13mm)",
            "9,5t",
            "4 metrar"
          ],
          [
            "LR961324",
            "G100 2-part (13mm)",
            "9,5t",
            "5 metrar"
          ],
          [
            "LR961325",
            "G100 2-part (13mm)",
            "9,5t",
            "6 metrar"
          ],
          [
            "LR970822",
            "G120 2-part (8mm)",
            "4,25t",
            "2 metrar"
          ],
          [
            "LR970824",
            "G120 2-part (8mm)",
            "4,25t",
            "4 metrar"
          ],
          [
            "LR971022",
            "G120 2-part (10mm)",
            "7,5t",
            "2 metrar"
          ],
          [
            "LR971024",
            "G120 2-part (10mm)",
            "7,5t",
            "4 metrar"
          ]
        ]
      }
    ]
  },
  {
    "id": "bordastrekkjarar",
    "path": [
      "bordastrekkjarar"
    ],
    "title": "Borðastrekkjarar",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur/07-d5932744.jpg",
      "alt": "",
      "width": 1439,
      "height": 507
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Borðastrekkjarar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Strappar fyrir bílaflutninga"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "LS5025HJ - Dekkjastrappar"
      },
      {
        "type": "text",
        "text": "5.0 tonn - 50 mm - 2.5 m með hring"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Hornvörn"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hornvörn - Plast"
      },
      {
        "type": "text",
        "text": "50 mm"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hornvörn - Stál"
      },
      {
        "type": "text",
        "text": "50 mm"
      }
    ],
    "images": [
      {
        "src": "/images/hifi-festibunadur/07-d5932744.jpg",
        "alt": "",
        "width": 1439,
        "height": 507
      },
      {
        "src": "/images/hifi-festibunadur__bordastrekkjarar/03-3fd39ac1.jpg",
        "alt": "",
        "width": 537,
        "height": 537
      },
      {
        "src": "/images/hifi-festibunadur__bordastrekkjarar/04-2a021642.jpg",
        "alt": "",
        "width": 537,
        "height": 567
      },
      {
        "src": "/images/hifi-festibunadur__bordastrekkjarar/04-2a021642.jpg",
        "alt": "",
        "width": 537,
        "height": 567
      }
    ],
    "tables": [
      {
        "heading": "Borðastrekkjarar",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "Burðarþol",
          "Lengd"
        ],
        "rows": [
          [
            "LS105",
            "Borðastrekkjari 25mm",
            "1,0t",
            "0,3m + 4,7m"
          ],
          [
            "LS206",
            "Borðastrekkjari 35mm",
            "2,0t",
            "0,5m + 5,5m"
          ],
          [
            "LS410",
            "Borðastrekkjari 50mm",
            "4,0t",
            "0,5m + 9,5m"
          ],
          [
            "LS410K",
            "Borðastrekkjari 50mm",
            "4,0t",
            "0,5m + 4,5m"
          ],
          [
            "LS510",
            "Borðastrekkjari 50mm",
            "5,0t",
            "0,5m + 9,5m"
          ]
        ],
        "images": [
          {
            "src": "/images/hifi-festibunadur/07-d5932744.jpg",
            "alt": "",
            "width": 1439,
            "height": 507
          }
        ]
      }
    ]
  },
  {
    "id": "hifikedjur",
    "path": [
      "hifikedjur"
    ],
    "title": "Hífikeðjur",
    "subtitle": "Vandaðar hífikeðjur með CE gæðavottun",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur/03-9bc801b8.jpg",
      "alt": "",
      "width": 1439,
      "height": 507
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Styrkleikar hífikeðja"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Grade 80"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Grade 100"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Grade 120"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Lengdir í boði",
        "range": {
          "min": "2 metrar",
          "max": "6 metrar"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Leyfilegt vinnuálag (WLL)",
        "range": {
          "min": "2.8 tonn",
          "max": "10.6 tonn"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Tveggja arma hífikeðjur"
      },
      {
        "type": "text",
        "text": "*Eins, þriggja og fjögurra arma hífikeðjur fást gegn sérpöntun"
      }
    ],
    "images": [],
    "tables": [
      {
        "heading": "Tveggja arma hífikeðjur",
        "headers": [
          "Vörunúmer",
          "Vöruheiti",
          "LVÁ/WLL",
          "Lengd"
        ],
        "rows": [
          [
            "LR950822",
            "G80 2-part (8mm)",
            "2.8t",
            "3 metrar"
          ],
          [
            "LR950823",
            "G80 2-part (8mm)",
            "2.8t",
            "4 metrar"
          ],
          [
            "LR950824",
            "G80 2-part (8mm)",
            "2.8t",
            "5 metrar"
          ],
          [
            "LR950825",
            "G80 2-part (8mm)",
            "2.8t",
            "6 metrar"
          ],
          [
            "LR950826",
            "G80 2-part (10mm)",
            "4.25t",
            "2 metrar"
          ],
          [
            "LR951022",
            "G80 2-part (10mm)",
            "4.25t",
            "3 metrar"
          ],
          [
            "LR951023",
            "G80 2-part (10mm)",
            "4.25t",
            "4 metrar"
          ],
          [
            "LR951024",
            "G80 2-part (10mm)",
            "4.25t",
            "5 metrar"
          ],
          [
            "LR951025",
            "G80 2-part (10mm)",
            "4.25t",
            "6 metrar"
          ],
          [
            "LR951026",
            "G80 2-part (13mm)",
            "7.5t",
            "2 metrar"
          ],
          [
            "LR951322",
            "G80 2-part (13mm)",
            "7.5t",
            "3 metrar"
          ],
          [
            "LR951323",
            "G80 2-part (13mm)",
            "7.5t",
            "4 metrar"
          ],
          [
            "LR951324",
            "G80 2-part (13mm)",
            "7.5t",
            "5 metrar"
          ],
          [
            "LR951325",
            "G80 2-part (13mm)",
            "7.5t",
            "6 metrar"
          ],
          [
            "LR960822",
            "G100 2-part (8mm)",
            "3.55t",
            "3 metrar"
          ],
          [
            "LR960823",
            "G100 2-part (8mm)",
            "3.55t",
            "4 metrar"
          ],
          [
            "LR960824",
            "G100 2-part (8mm)",
            "3.55t",
            "5 metrar"
          ],
          [
            "LR960825",
            "G100 2-part (8mm)",
            "3.55t",
            "6 metrar"
          ],
          [
            "LR960826",
            "G100 2-part (10mm)",
            "5.6t",
            "2 metrar"
          ],
          [
            "LR961022",
            "G100 2-part (10mm)",
            "5.6t",
            "3 metrar"
          ],
          [
            "LR961023",
            "G100 2-part (10mm)",
            "5.6t",
            "4 metrar"
          ],
          [
            "LR961024",
            "G100 2-part (10mm)",
            "5.6t",
            "5 metrar"
          ],
          [
            "LR961025",
            "G100 2-part (10mm)",
            "5.6t",
            "6 metrar"
          ],
          [
            "LR961026",
            "G100 2-part (13mm)",
            "9.5t",
            "2 metrar"
          ],
          [
            "LR961322",
            "G100 2-part (13mm)",
            "9.5t",
            "3 metrar"
          ],
          [
            "LR961323",
            "G100 2-part (13mm)",
            "9.5t",
            "4 metrar"
          ],
          [
            "LR961324",
            "G100 2-part (13mm)",
            "9.5t",
            "5 metrar"
          ],
          [
            "LR961325",
            "G100 2-part (13mm)",
            "9.5t",
            "6 metrar"
          ]
        ]
      }
    ]
  },
  {
    "id": "stroffur",
    "path": [
      "stroffur"
    ],
    "title": "Stroffur",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur/06-1c399280.jpg",
      "alt": "",
      "width": 1439,
      "height": 507
    },
    "blocks": [
      {
        "type": "link",
        "text": "Hringstroffur",
        "href": "/hifi-festibunadur/stroffur/hringstroffur"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hringstroffur"
      },
      {
        "type": "link",
        "text": "Flatstroffur",
        "href": "/hifi-festibunadur/stroffur/flatstroffur"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Flatstroffur"
      },
      {
        "type": "link",
        "text": "Dráttastroffur",
        "href": "/hifi-festibunadur/stroffur/drattastroffur"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Dráttastroffur"
      }
    ],
    "images": [
      {
        "src": "/images/hifi-festibunadur__stroffur/02-07f1d253.jpg",
        "alt": "",
        "width": 383,
        "height": 134
      },
      {
        "src": "/images/hifi-festibunadur__stroffur/03-da4c3fc0.jpg",
        "alt": "",
        "width": 383,
        "height": 134
      },
      {
        "src": "/images/hifi-festibunadur__stroffur/04-1135c828.jpg",
        "alt": "",
        "width": 348,
        "height": 321
      }
    ],
    "children": [
      "hringstroffur",
      "flatstroffur",
      "drattastroffur"
    ]
  },
  {
    "id": "drattastroffur",
    "path": [
      "stroffur",
      "drattastroffur"
    ],
    "title": "Dráttastroffur",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur__stroffur/04-1135c828.jpg",
      "alt": "",
      "width": 348,
      "height": 321
    },
    "blocks": [
      {
        "type": "heading",
        "level": 3,
        "text": "BS12T6M - Dráttastroffa"
      },
      {
        "type": "text",
        "text": "12 tonn - 6 metrar"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "BS24T6M - Dráttastroffa"
      },
      {
        "type": "text",
        "text": "24 tonn - 6 metrar"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "BS36T6M - Dráttastroffa"
      },
      {
        "type": "text",
        "text": "36 tonn - 6 metrar"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "BS48T6M - Dráttastroffa"
      },
      {
        "type": "text",
        "text": "48 tonn - 6 metrar"
      }
    ],
    "images": [
      {
        "src": "/images/hifi-festibunadur__stroffur/04-1135c828.jpg",
        "alt": "",
        "width": 348,
        "height": 321
      },
      {
        "src": "/images/hifi-festibunadur__stroffur/04-1135c828.jpg",
        "alt": "",
        "width": 348,
        "height": 321
      },
      {
        "src": "/images/hifi-festibunadur__stroffur/04-1135c828.jpg",
        "alt": "",
        "width": 348,
        "height": 321
      },
      {
        "src": "/images/hifi-festibunadur__stroffur/04-1135c828.jpg",
        "alt": "",
        "width": 348,
        "height": 321
      }
    ]
  },
  {
    "id": "flatstroffur",
    "path": [
      "stroffur",
      "flatstroffur"
    ],
    "title": "Flatstroffur",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur__stroffur/03-da4c3fc0.jpg",
      "alt": "",
      "width": 1439,
      "height": 507
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Flatstroffur / Borðastroffur"
      },
      {
        "type": "text",
        "text": "Flatstroffur með öryggistuðul upp á 7:1. Einfaldar stroffur með styrkt augu í hvorum enda."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Þyngdarþol í boði",
        "range": {
          "min": "1 tonn",
          "max": "8 tonn"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Lengd í boði",
        "range": {
          "min": "1 metrar",
          "max": "14 metrar"
        }
      }
    ],
    "images": [],
    "tables": [
      {
        "heading": "Lengd í boði",
        "headers": [
          "Vörunr.",
          "Vara",
          "Lyftigeta",
          "Lyftihæð"
        ],
        "rows": [
          [
            "830101",
            "Flatstroffa fjólublá",
            "1 tonn",
            "1 meter"
          ],
          [
            "830102",
            "Flatstroffa fjólublá",
            "1 tonn",
            "2 metrar"
          ],
          [
            "830103",
            "Flatstroffa fjólublá",
            "1 tonn",
            "3 metrar"
          ],
          [
            "830104",
            "Flatstroffa fjólublá",
            "1 tonn",
            "4 metrar"
          ],
          [
            "830105",
            "Flatstroffa fjólublá",
            "1 tonn",
            "5 metrar"
          ],
          [
            "830106",
            "Flatstroffa fjólublá",
            "1 tonn",
            "6 metrar"
          ],
          [
            "830108",
            "Flatstroffa fjólublá",
            "1 tonn",
            "8 metrar"
          ],
          [
            "830110",
            "Flatstroffa fjólublá",
            "1 tonn",
            "10 metrar"
          ],
          [
            "830112",
            "Flatstroffa fjólublá",
            "1 tonn",
            "12 metrar"
          ],
          [
            "830201",
            "Flatstroffa græn",
            "2 tonn",
            "1 meter"
          ],
          [
            "830202",
            "Flatstroffa græn",
            "2 tonn",
            "2 metrar"
          ],
          [
            "830203",
            "Flatstroffa græn",
            "2 tonn",
            "3 metrar"
          ],
          [
            "830204",
            "Flatstroffa græn",
            "2 tonn",
            "4 metrar"
          ],
          [
            "830205",
            "Flatstroffa græn",
            "2 tonn",
            "5 metrar"
          ],
          [
            "830206",
            "Flatstroffa græn",
            "2 tonn",
            "6 metrar"
          ],
          [
            "830208",
            "Flatstroffa græn",
            "2 tonn",
            "8 metrar"
          ],
          [
            "830210",
            "Flatstroffa græn",
            "2 tonn",
            "10 metrar"
          ],
          [
            "830212",
            "Flatstroffa græn",
            "2 tonn",
            "12 metrar"
          ],
          [
            "830301",
            "Flatstroffa gul",
            "3 tonn",
            "1 meter"
          ],
          [
            "830302",
            "Flatstroffa gul",
            "3 tonn",
            "2 metrar"
          ],
          [
            "830303",
            "Flatstroffa gul",
            "3 tonn",
            "3 metrar"
          ],
          [
            "830304",
            "Flatstroffa gul",
            "3 tonn",
            "4 metrar"
          ],
          [
            "830305",
            "Flatstroffa gul",
            "3 tonn",
            "5 metrar"
          ],
          [
            "830306",
            "Flatstroffa gul",
            "3 tonn",
            "6 metrar"
          ],
          [
            "830308",
            "Flatstroffa gul",
            "3 tonn",
            "8 metrar"
          ],
          [
            "830310",
            "Flatstroffa gul",
            "3 tonn",
            "10 metrar"
          ],
          [
            "830312",
            "Flatstroffa gul",
            "3 tonn",
            "12 metrar"
          ],
          [
            "830314",
            "Flatstroffa gul",
            "3 tonn",
            "14 metrar"
          ],
          [
            "830501",
            "Flatstroffa rauð",
            "5 tonn",
            "1 meter"
          ],
          [
            "830502",
            "Flatstroffa rauð",
            "5 tonn",
            "2 metrar"
          ],
          [
            "830503",
            "Flatstroffa rauð",
            "5 tonn",
            "3 metrar"
          ],
          [
            "830504",
            "Flatstroffa rauð",
            "5 tonn",
            "4 metrar"
          ],
          [
            "830505",
            "Flatstroffa rauð",
            "5 tonn",
            "5 metrar"
          ],
          [
            "830506",
            "Flatstroffa rauð",
            "5 tonn",
            "6 metrar"
          ],
          [
            "830508",
            "Flatstroffa rauð",
            "5 tonn",
            "8 metrar"
          ],
          [
            "830510",
            "Flatstroffa rauð",
            "5 tonn",
            "10 metrar"
          ],
          [
            "830512",
            "Flatstroffa rauð",
            "5 tonn",
            "12 metrar"
          ],
          [
            "830514",
            "Flatstroffa rauð",
            "5 tonn",
            "14 metrar"
          ],
          [
            "830806",
            "Flatstroffa blá",
            "8 tonn",
            "6 metrar"
          ],
          [
            "830808",
            "Flatstroffa blá",
            "8 tonn",
            "8 metrar"
          ]
        ]
      }
    ]
  },
  {
    "id": "hringstroffur",
    "path": [
      "stroffur",
      "hringstroffur"
    ],
    "title": "Hringstroffur",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/hifi-festibunadur__stroffur/02-07f1d253.jpg",
      "alt": "",
      "width": 1439,
      "height": 507
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Hringstroffur"
      },
      {
        "type": "text",
        "text": "Tveggja laga hringstroffur. Stroffurnar eru með öryggisstuðul upp á 7:1. Lengdin er gefin upp í lyftihæð, þannig að 2 metra hringstroffa er 4 metrar að ummáli."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Þyngdarþol í boði",
        "range": {
          "min": "1 tonn",
          "max": "10 tonn"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Lengd í boði",
        "range": {
          "min": "0.5 metrar",
          "max": "10 metrar"
        }
      }
    ],
    "images": [],
    "tables": [
      {
        "heading": "Lengd í boði",
        "headers": [
          "Vörunr.",
          "Vara",
          "Lyftigeta",
          "Lyftihæð"
        ],
        "rows": [
          [
            "820105",
            "Hringstroffa fjólublá",
            "1 tonn",
            "0.5 meter"
          ],
          [
            "820110",
            "Hringstroffa fjólublá",
            "1 tonn",
            "1 meter"
          ],
          [
            "820115",
            "Hringstroffa fjólublá",
            "1 tonn",
            "1.5 meter"
          ],
          [
            "820120",
            "Hringstroffa fjólublá",
            "1 tonn",
            "2 metrar"
          ],
          [
            "820125",
            "Hringstroffa fjólublá",
            "1 tonn",
            "2.5 metrar"
          ],
          [
            "820130",
            "Hringstroffa fjólublá",
            "1 tonn",
            "3 metrar"
          ],
          [
            "820140",
            "Hringstroffa fjólublá",
            "1 tonn",
            "4 metrar"
          ],
          [
            "820150",
            "Hringstroffa fjólublá",
            "1 tonn",
            "5 metrar"
          ],
          [
            "820160",
            "Hringstroffa fjólublá",
            "1 tonn",
            "6 metrar"
          ],
          [
            "820205",
            "Hringstroffa græn",
            "2 tonn",
            "0.5 meter"
          ],
          [
            "820210",
            "Hringstroffa græn",
            "2 tonn",
            "1 meter"
          ],
          [
            "8202100",
            "Hringstroffa græn",
            "2 tonn",
            "10 metrar"
          ],
          [
            "820215",
            "Hringstroffa græn",
            "2 tonn",
            "1.5 meter"
          ],
          [
            "820220",
            "Hringstroffa græn",
            "2 tonn",
            "2 metrar"
          ],
          [
            "820225",
            "Hringstroffa græn",
            "2 tonn",
            "2.5 metrar"
          ],
          [
            "820230",
            "Hringstroffa græn",
            "2 tonn",
            "3 metrar"
          ],
          [
            "820240",
            "Hringstroffa græn",
            "2 tonn",
            "4 metrar"
          ],
          [
            "820250",
            "Hringstroffa græn",
            "2 tonn",
            "5 metrar"
          ],
          [
            "820260",
            "Hringstroffa græn",
            "2 tonn",
            "6 metrar"
          ],
          [
            "820280",
            "Hringstroffa græn",
            "2 tonn",
            "8 metrar"
          ],
          [
            "820310",
            "Hringstroffa gul",
            "3 tonn",
            "1 meter"
          ],
          [
            "820315",
            "Hringstroffa gul",
            "3 tonn",
            "1.5 meter"
          ],
          [
            "820320",
            "Hringstroffa gul",
            "3 tonn",
            "2 metrar"
          ],
          [
            "820325",
            "Hringstroffa gul",
            "3 tonn",
            "2.5 metrar"
          ],
          [
            "820330",
            "Hringstroffa gul",
            "3 tonn",
            "3 metrar"
          ],
          [
            "820340",
            "Hringstroffa gul",
            "3 tonn",
            "4 metrar"
          ],
          [
            "820350",
            "Hringstroffa gul",
            "3 tonn",
            "5 metrar"
          ],
          [
            "820360",
            "Hringstroffa gul",
            "3 tonn",
            "6 metrar"
          ],
          [
            "820515",
            "Hringstroffa rauð",
            "5 tonn",
            "1.5 meter"
          ],
          [
            "820520",
            "Hringstroffa rauð",
            "5 tonn",
            "2 metrar"
          ],
          [
            "820525",
            "Hringstroffa rauð",
            "5 tonn",
            "2.5 metrar"
          ],
          [
            "820530",
            "Hringstroffa rauð",
            "5 tonn",
            "3 metrar"
          ],
          [
            "820540",
            "Hringstroffa rauð",
            "5 tonn",
            "4 metrar"
          ],
          [
            "820550",
            "Hringstroffa rauð",
            "5 tonn",
            "5 metrar"
          ],
          [
            "820560",
            "Hringstroffa rauð",
            "5 tonn",
            "6 metrar"
          ],
          [
            "820660",
            "Hringstroffa brún",
            "6 tonn",
            "6 metrar"
          ],
          [
            "8208100",
            "Hringstroffa blá",
            "8 tonn",
            "10 metrar"
          ],
          [
            "820820",
            "Hringstroffa blá",
            "8 tonn",
            "2 metrar"
          ],
          [
            "820830",
            "Hringstroffa blá",
            "8 tonn",
            "3 metrar"
          ],
          [
            "820840",
            "Hringstroffa blá",
            "8 tonn",
            "4 metrar"
          ],
          [
            "820850",
            "Hringstroffa blá",
            "8 tonn",
            "5 metrar"
          ],
          [
            "820860",
            "Hringstroffa blá",
            "8 tonn",
            "6 metrar"
          ],
          [
            "820880",
            "Hringstroffa blá",
            "8 tonn",
            "8 metrar"
          ],
          [
            "821020",
            "Hringstroffa appelsínugul",
            "10 tonn",
            "2 metrar"
          ],
          [
            "821030",
            "Hringstroffa appelsínugul",
            "10 tonn",
            "3 metrar"
          ],
          [
            "821040",
            "Hringstroffa appelsínugul",
            "10 tonn",
            "4 metrar"
          ],
          [
            "821050",
            "Hringstroffa appelsínugul",
            "10 tonn",
            "5 metrar"
          ],
          [
            "821060",
            "Hringstroffa appelsínugul",
            "10 tonn",
            "6 metrar"
          ]
        ]
      }
    ]
  }
];
