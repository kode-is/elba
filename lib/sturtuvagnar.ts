// GENERATED FILE — do not edit by hand.
// Run `npm run gen-sturtuvagnar` (scripts/gen-sturtuvagnar.mjs) to
// regenerate from docs/scrape/sturtuvagnar__*.json (30 files: 5 wagon
// groups + 25 wagon/product pages). See that script for the parsing rules.
// The /sturtuvagnar category page itself is not generated here — its
// content lives directly in app/sturtuvagnar/page.tsx.

import type { Img } from "./types";

export type WagonBlock = { type: "heading" | "text"; level?: number; text: string };

export type WagonGroup = {
  id: string;
  slug: string;
  /** H1 / display title. */
  title: string;
  /** Scraped <title>, e.g. "Hjólagröfuvagnar - Skralli - Þinn samstarfsaðili". */
  pageTitle: string;
  /** Scraped <meta description>. */
  description: string;
  heroImage: Img;
  /** Body content (verbatim), excluding the H1, breadcrumb and ContactCta blocks. */
  blocks: WagonBlock[];
  /** Content images (verbatim, in order), excluding the hero image. */
  images: Img[];
  /** The group's "Um X" paragraphs (verbatim, in order). */
  about: string[];
  /** Slugs of this group's Wagons, in "Tegundir í boði" card order. */
  products: string[];
};

export type Wagon = {
  id: string;
  slug: string;
  /** H1 / display title. */
  title: string;
  /** Owning WagonGroup's `slug`/`id`, derived from this page's first H2. */
  groupId: string;
  /** Scraped <title>, e.g. "GW-100 - Skralli - Þinn samstarfsaðili". */
  pageTitle: string;
  /** Scraped <meta description>. */
  description: string;
  heroImage: Img;
  /** Body content (verbatim): the group-title H2 and the "Tegundir í boði" H2. */
  blocks: WagonBlock[];
  images: Img[];
  /** Blurb text from this product's card on its group's "Tegundir í boði" section. */
  blurb: string;
  /** Card image from this product's card on its group's "Tegundir í boði" section. */
  cardImage: Img;
};

export type GroupFeatures = { heading: string; items: string[] };

export const wagonGroups: WagonGroup[] = [
  {
    "id": "fjorhjola-minigrofuvagnar",
    "slug": "fjorhjola-minigrofuvagnar",
    "title": "Fjórhjóla- og minigröfuvagnar",
    "pageTitle": "Fjórhjóla- og minigröfuvagnar - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/03-fbea7ee5.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Um fjórhjóla- og minigröfuvagna"
      },
      {
        "type": "text",
        "text": "Flaggskipin meðal fjórhjóla- og minigröfuvagna. Sterkir sturtuvagnar með veltihásingu fullkomnir í öll þau verkefni þar sem þörf er á því að geta flutt mikið af efni á erfiða slóða eða þar sem aðgengi er þröngt. Sem staðalbúnaður fylgir handlæst afturvör og tvívirk handdæla sem tryggir skjóta losun upp í u.þ.b. 50 gráðu sturtuhalla. Vagnarnir eru sandblásnir og lakkaðir með sérstöku tvíþættu lakki."
      },
      {
        "type": "text",
        "text": "Vagnarnir fást í mörgum litum. Hardox® kassi, rafmagnssturta með fjarstýringu, sjálfvirk vör, ljósapakki og fleira af aukabúnaði í boði."
      },
      {
        "type": "text",
        "text": "Vagnarnir eru ekki skráningsskyldir en hægt er að skrá það ef ljósapakki er keyptur sem aukabúnaður."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "GW-100"
      },
      {
        "type": "text",
        "text": "Nettari útgáfan af Gigant fjóhjóla- og minigröfuvagninum. 150x100x35 sm. Sterkbyggður og lipur sturtuvagn sem þú getur dregið með þér hvert sem þú ert að fara."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "GW-120"
      },
      {
        "type": "text",
        "text": "Stóra útgáfan af Gigant fjóhjóla- og minigröfuvagninum. 180x122x35 sm. Sterkbyggður og lipur sturtuvagn sem getur borið það sem þú þarft, þangað sem þú þarft það."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "GW-400"
      },
      {
        "type": "text",
        "text": "Sterkur og praktískur vagn hannaður fyrir flutninga á timbri á ógreiðfærum svæðum. Hentugur fyrir trjádrumba allt að 3 metra í lengd."
      }
    ],
    "images": [
      {
        "src": "/images/sturtuvagnar__fjorhjola-minigrofuvagnar/03-7c492611.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar/03-fbea7ee5.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__fjorhjola-minigrofuvagnar/05-8f3b6a1b.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      }
    ],
    "products": [
      "gw-100",
      "gw-120",
      "gw-400"
    ],
    "about": [
      "Flaggskipin meðal fjórhjóla- og minigröfuvagna. Sterkir sturtuvagnar með veltihásingu fullkomnir í öll þau verkefni þar sem þörf er á því að geta flutt mikið af efni á erfiða slóða eða þar sem aðgengi er þröngt. Sem staðalbúnaður fylgir handlæst afturvör og tvívirk handdæla sem tryggir skjóta losun upp í u.þ.b. 50 gráðu sturtuhalla. Vagnarnir eru sandblásnir og lakkaðir með sérstöku tvíþættu lakki.",
      "Vagnarnir fást í mörgum litum. Hardox® kassi, rafmagnssturta með fjarstýringu, sjálfvirk vör, ljósapakki og fleira af aukabúnaði í boði.",
      "Vagnarnir eru ekki skráningsskyldir en hægt er að skrá það ef ljósapakki er keyptur sem aukabúnaður."
    ]
  },
  {
    "id": "verktakavagnar",
    "slug": "verktakavagnar",
    "title": "Verktakavagnar",
    "pageTitle": "Verktakavagnar - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/04-76280b19.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Um verktakavagna"
      },
      {
        "type": "text",
        "text": "Verktakalínan kynnir það besta af því besta þegar kemur að sturtuvögnum frá Gigant. Sturtuvagnar með burðargetu frá 13 upp í 30 tonn. Vagnarnir eru þróaður í nánu sambandi við bæði viðskiptavini og samstarfsaðila til að koma til móts við þá allra kröfuhörðustu. Vagnarnir eru einstaklega slitsterkir og koma búnir með fjölda af einkennandi staðalbúnaði ásamt því að hafa stórt úrval af aukabúnaði í boði."
      },
      {
        "type": "text",
        "text": "Okkar viðskiptavinir hafa í árabil hrósað bæði stöðugleika og fjölhæfni vagnana - við elskum þá og okkur grunar að þú munir gera það líka."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Verktakavagn GD3-13"
      },
      {
        "type": "text",
        "text": "þetta er minnsti verktakavagninn frá Gigant, en hér er ekkert sem vantar. 13 tonna burðargeta, sterkur staðalbúnaður og úrval af aukabúnaði veitir mikinn sveigjanleika."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Verktakavagn GD4-15"
      },
      {
        "type": "text",
        "text": "Hinn fullkomni millivegur? GD4-15 er mest selgdi Gigant sturtuvagninn í þessari línu einkenndur af háu burðarþoli og lágri hæð."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Verktakavagn GD4-17"
      },
      {
        "type": "text",
        "text": "Afkastamikill sturtuvagn sem sinnir sínu bæði í fjöbreittum landbúnaðarverkum og við þunga flutninga."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Verktakavagn GD4-17SB"
      },
      {
        "type": "text",
        "text": "Einstakur vagn sem sameinar hlutverk sturtuvagns og vélavagns. Hleðsluplan vagnsins færist 1,5 meter aftur svo hægt er að keyra upp á hann."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Verktakavagn GD4-20"
      },
      {
        "type": "text",
        "text": "Risa 2 öxla vagn sem fer létt með jafnvel mest krefjandi verekfnin. Vagninn er skráður með 19 tonna burðargetu en getur sturtað allt að 50 tonnum."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Verktakavagn GD4-30HS"
      },
      {
        "type": "text",
        "text": "Stærsti sturtuvagninn sem Gigant framleiðir. 30 tonna vagn sem hannaður er til að þola allt sem þú getur hugsað þér að setja í hann."
      }
    ],
    "images": [
      {
        "src": "/images/sturtuvagnar__verktakavagnar/03-3b32cbaa.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__verktakavagnar/04-52c63e09.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__verktakavagnar/05-2b5a425a.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__verktakavagnar/06-11b07009.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__verktakavagnar/07-2a595009.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__verktakavagnar/08-5e05cfbf.jpg",
        "alt": "",
        "width": 1440,
        "height": 681
      }
    ],
    "products": [
      "verktakavagn-gd3-13",
      "verktakavagn-gd4-15",
      "verktakavagn-gd4-17",
      "verktakavagn-gd4-17sb",
      "verktakavagn-gd4-20",
      "verktakavagn-gd4-30hs"
    ],
    "about": [
      "Verktakalínan kynnir það besta af því besta þegar kemur að sturtuvögnum frá Gigant. Sturtuvagnar með burðargetu frá 13 upp í 30 tonn. Vagnarnir eru þróaður í nánu sambandi við bæði viðskiptavini og samstarfsaðila til að koma til móts við þá allra kröfuhörðustu. Vagnarnir eru einstaklega slitsterkir og koma búnir með fjölda af einkennandi staðalbúnaði ásamt því að hafa stórt úrval af aukabúnaði í boði.",
      "Okkar viðskiptavinir hafa í árabil hrósað bæði stöðugleika og fjölhæfni vagnana - við elskum þá og okkur grunar að þú munir gera það líka."
    ]
  },
  {
    "id": "landbunadarvagnar",
    "slug": "landbunadarvagnar",
    "title": "Landbúnaðarvagnar",
    "pageTitle": "Landbúnaðarvagnar - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/05-468e8526.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Um landbúnaðarvagna"
      },
      {
        "type": "text",
        "text": "Landbúnaðarvagnar frá Gigant er lína af sturtuvögnum sem byggir á einfaldleika og skilvirkni. Markmiðið var að þróa vagn á þeim grunnatriðum sem bændur hafa þörf á ásamt fjólbreyttu úrvali af aukabúnaði. Þannig getur þú byggt nákvæmlega þann vagn sem þú hefur þörf á fyrir þína notkun."
      },
      {
        "type": "text",
        "text": "Ekkert rugl, bara eitthvað sem virkar."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Landbúnaðarvagn GD85"
      },
      {
        "type": "text",
        "text": "8 tonna sturtuvagn sem er hannaður til að geta sinnt öllum helstu verkefnum í sveitinni."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Landbúnaðarvagn GD100"
      },
      {
        "type": "text",
        "text": "10 tonna sturtuvagn fyrir þá sem þurfa aðeins meira. Endingargóður og sterkbyggður vagn sem getur sinnt mörgum hlutverkum."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Landbúnaðarvagn GD125"
      },
      {
        "type": "text",
        "text": "Þessi 12 tonna sturtuvagn sameinar fullkomna burðargetu, lengd, hæð og burðargetu til að koma til móts við kröfuharða bændur."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Landbúnaðarvagn GD140 / GD140SB"
      },
      {
        "type": "text",
        "text": "Sterkbyggður og langur 14 tonna sturtuvagn sem kemur til bjargar þegar aðrir vagnar duga ekki til."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Landbúnaðarvagn GD150"
      },
      {
        "type": "text",
        "text": "Það allra sterkasta sem Gigant framleiðir af landbúnaðarvögnum. Vagninn á myndinni er uppfærður með hækkuðum hliðum fyrir öruggan flutning á heyi."
      }
    ],
    "images": [
      {
        "src": "/images/sturtuvagnar__landbunadarvagnar/03-220dd5a7.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar/05-468e8526.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__landbunadarvagnar/05-8e7db8cb.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__landbunadarvagnar/06-ce0e3628.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__landbunadarvagnar/07-1b890124.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      }
    ],
    "products": [
      "landbunadarvagn-gd85",
      "landbunadarvagn-gd100",
      "landbunadarvagn-gd125",
      "landbunadarvagn-gd140-gd140sb",
      "landbunadarvagn-gd150"
    ],
    "about": [
      "Landbúnaðarvagnar frá Gigant er lína af sturtuvögnum sem byggir á einfaldleika og skilvirkni. Markmiðið var að þróa vagn á þeim grunnatriðum sem bændur hafa þörf á ásamt fjólbreyttu úrvali af aukabúnaði. Þannig getur þú byggt nákvæmlega þann vagn sem þú hefur þörf á fyrir þína notkun.",
      "Ekkert rugl, bara eitthvað sem virkar."
    ]
  },
  {
    "id": "hjolagrofuvagnar",
    "slug": "hjolagrofuvagnar",
    "title": "Hjólagröfuvagnar",
    "pageTitle": "Hjólagröfuvagnar - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/06-dece8e00.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Um hjólagröfuvagna"
      },
      {
        "type": "text",
        "text": "Hjólgröfuvagnarnir frá Gigant hafa verið þróaðir í náinni samvinnu við viðskiptavini og samstarfsaðila. Þeir eru búnir ýmsum búnaði sem gerir þá einstaklega þægilega í notkun og hafa þannig orðið mest seldu hjólagröfuvagnarnir á Íslandi."
      },
      {
        "type": "text",
        "text": "Það sem gerir hjólagröfuvagnana frá Gigant einstaka er að þeir eru með sérhannað bremsukerfi fyrir hjólagröfur, en þær eru með lægri bremsuþrýsting en dráttarvélar. Þetta fer betur með vélina þína og tryggir örugga notkun í öllum aðstæðum."
      },
      {
        "type": "text",
        "text": "Við aðstoðum þig við að velja réttan aukabúnað, allt frá sérstökum ljósabúnaði eða dráttarkúlu sem situr þéttingsfast við vagninn."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hjólagröfuvagn GD2-6X"
      },
      {
        "type": "text",
        "text": "Fyrir 8-12 tonna hjólagröfur. Tilvalinn fyrir minni framkvæmdavinnu þar sem lipurleiki og skilvirkni er í fyrirrúmi."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hjólagröfuvagn GD3-6X"
      },
      {
        "type": "text",
        "text": "Fyrir allt frá 10 tonna gröfum. Sérsmíðaður kassi úr Hardox 500 TUF, hálfmáni að framan, innfeldar hliðar og vökvavör að aftan gera auðvelt að bæði moka í og sturta úr vagninum."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hjólagröfuvagn GD3-8X"
      },
      {
        "type": "text",
        "text": "Hjólagröfuvagn sérhannaður fyrir hjólagröfur milli 14 og 20 tonna. Þetta módel er þekkt fyrir gæði og áreiðanleika og er okkar vinsælasta útfærsla."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Hjólagröfuvagn GD3-10X"
      },
      {
        "type": "text",
        "text": "Stærsti hjólagröfuvagninn frá Gigant. Smíðaður fyrir 14 til 20 tonna hjólagröfur í 2-axla útgáfu. Afkastamikill í mjög krefjandi aðstæðunum."
      }
    ],
    "images": [
      {
        "src": "/images/sturtuvagnar__hjolagrofuvagnar/03-110f9e47.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__hjolagrofuvagnar/04-2800ed53.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__hjolagrofuvagnar/05-618fd2d3.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__hjolagrofuvagnar/06-c4742971.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      }
    ],
    "products": [
      "hjolagrofuvagn-gd2-6x",
      "hjolagrofuvagn-gd3-6x",
      "hjolagrofuvagn-gd3-8x",
      "hjolagrofuvagn-gd3-10x"
    ],
    "about": [
      "Hjólgröfuvagnarnir frá Gigant hafa verið þróaðir í náinni samvinnu við viðskiptavini og samstarfsaðila. Þeir eru búnir ýmsum búnaði sem gerir þá einstaklega þægilega í notkun og hafa þannig orðið mest seldu hjólagröfuvagnarnir á Íslandi.",
      "Það sem gerir hjólagröfuvagnana frá Gigant einstaka er að þeir eru með sérhannað bremsukerfi fyrir hjólagröfur, en þær eru með lægri bremsuþrýsting en dráttarvélar. Þetta fer betur með vélina þína og tryggir örugga notkun í öllum aðstæðum.",
      "Við aðstoðum þig við að velja réttan aukabúnað, allt frá sérstökum ljósabúnaði eða dráttarkúlu sem situr þéttingsfast við vagninn."
    ]
  },
  {
    "id": "velaflutningavagnar",
    "slug": "velaflutningavagnar",
    "title": "Vélaflutningavagnar",
    "pageTitle": "Vélaflutningavagnar - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/07-e61a69c9.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Um vélavagna"
      },
      {
        "type": "text",
        "text": "Gigant vélavagnar eru hannaðir og smíðaðir með áreiðanleika efst í huga. Vagnarnir koma með öllum þeim festipunktum og akkerum sem vélamanninn gæti dreymt um. Þeir eru búnir styrktri grind og extra sterkri fjöðrun sem tryggir örugga lestun og mjúkan flutning. Vagnarnir eru allir sandblásnir og lakkaðir með tvíþættu lakki fyrir hámarks vörn gegn slitskemmdum."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn ML80"
      },
      {
        "type": "text",
        "text": "Minnsti vélavagninn frá Gigant. Þessi lipri og netti vagn er fullkominn fyrir þá sem þurfa öflugann og stöðugan vagn í minni verkefni."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn ML160"
      },
      {
        "type": "text",
        "text": "Fullkominn vélavagn fyrir þá sem kunna að meta einfaldleika og skilvirkni. Með 16 tonna burðargetu og nóg af festipunktum er þetta vagn sem hentar vel í flest verk."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn ML210"
      },
      {
        "type": "text",
        "text": "Stærsti vélavagninn í ML seríunni af einfaldari vélavögnum. Stór og hagkvæmur vélavagn sem getur borið allt að 23 tonna þunga vél."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn GLL4-18"
      },
      {
        "type": "text",
        "text": "Tveggja öxla vagn með öllu því sem alvöru vagni ber að hafa. 20,5 tonna skráð burðargeta en þessi vagn getur léttilega borið meira en það."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn GLL4-18L"
      },
      {
        "type": "text",
        "text": "Lengri útgáfa af GLL4-18. Sami 40 mm eikarbotninn og 20 tonna burðargeta. Fullkominn vagn fyrir þá sem þurfa aðeins meira pláss."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn GLL4-24"
      },
      {
        "type": "text",
        "text": "Sterkbyggður og afkastamikill vagn sem ber það sem þú þarft að flytja - og aðeins meira. Ramminn er smíðaður fyrir mun meira en það sem vagninn er skráður fyrir og gerður til að þola það sem þú setur á hann."
      },
      {
        "type": "heading",
        "level": 3,
        "text": "Vélavagn GLL4-27"
      },
      {
        "type": "text",
        "text": "3 öxlar, 40mm eikarbotn, 8 metra langur, fullt af festipunktum og yfir 28 tonna burðargeta - hér er erfitt að finna eitthvað sem vantar."
      }
    ],
    "images": [
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/03-8f824b7e.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/04-c648de43.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/05-74778fd7.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/06-b6580a67.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/07-bf266b5d.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/08-09e513a1.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      },
      {
        "src": "/images/sturtuvagnar__velaflutningavagnar/09-346d121d.jpg",
        "alt": "",
        "width": 1440,
        "height": 1440
      }
    ],
    "products": [
      "velavagn-ml80",
      "velavagn-ml160",
      "velavagn-ml210",
      "velavagn-gll4-18",
      "velavagn-gll4-18l",
      "velavagn-gll4-24",
      "velavagn-gll4-27"
    ],
    "about": [
      "Gigant vélavagnar eru hannaðir og smíðaðir með áreiðanleika efst í huga. Vagnarnir koma með öllum þeim festipunktum og akkerum sem vélamanninn gæti dreymt um. Þeir eru búnir styrktri grind og extra sterkri fjöðrun sem tryggir örugga lestun og mjúkan flutning. Vagnarnir eru allir sandblásnir og lakkaðir með tvíþættu lakki fyrir hámarks vörn gegn slitskemmdum."
    ]
  }
];

export const wagons: Wagon[] = [
  {
    "id": "gw-100",
    "slug": "gw-100",
    "title": "GW-100",
    "groupId": "fjorhjola-minigrofuvagnar",
    "pageTitle": "GW-100 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__fjorhjola-minigrofuvagnar/03-7c492611.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Fjórhjóla- og minigröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Nettari útgáfan af Gigant fjóhjóla- og minigröfuvagninum. 150x100x35 sm. Sterkbyggður og lipur sturtuvagn sem þú getur dregið með þér hvert sem þú ert að fara.",
    "cardImage": {
      "src": "/images/sturtuvagnar__fjorhjola-minigrofuvagnar/03-7c492611.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "gw-120",
    "slug": "gw-120",
    "title": "GW-120",
    "groupId": "fjorhjola-minigrofuvagnar",
    "pageTitle": "GW-120 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/03-fbea7ee5.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Fjórhjóla- og minigröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Stóra útgáfan af Gigant fjóhjóla- og minigröfuvagninum. 180x122x35 sm. Sterkbyggður og lipur sturtuvagn sem getur borið það sem þú þarft, þangað sem þú þarft það.",
    "cardImage": {
      "src": "/images/sturtuvagnar/03-fbea7ee5.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "gw-400",
    "slug": "gw-400",
    "title": "GW-400",
    "groupId": "fjorhjola-minigrofuvagnar",
    "pageTitle": "GW-400 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__fjorhjola-minigrofuvagnar/05-8f3b6a1b.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Fjórhjóla- og minigröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Sterkur og praktískur vagn hannaður fyrir flutninga á timbri á ógreiðfærum svæðum. Hentugur fyrir trjádrumba allt að 3 metra í lengd.",
    "cardImage": {
      "src": "/images/sturtuvagnar__fjorhjola-minigrofuvagnar/05-8f3b6a1b.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "hjolagrofuvagn-gd2-6x",
    "slug": "hjolagrofuvagn-gd2-6x",
    "title": "Hjólagröfuvagn GD2-6X",
    "groupId": "hjolagrofuvagnar",
    "pageTitle": "Hjólagröfuvagn GD2-6X - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/03-110f9e47.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Hjólagröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Fyrir 8-12 tonna hjólagröfur. Tilvalinn fyrir minni framkvæmdavinnu þar sem lipurleiki og skilvirkni er í fyrirrúmi.",
    "cardImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/03-110f9e47.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "hjolagrofuvagn-gd3-10x",
    "slug": "hjolagrofuvagn-gd3-10x",
    "title": "Hjólagröfuvagn GD3-10X",
    "groupId": "hjolagrofuvagnar",
    "pageTitle": "Hjólagröfuvagn GD3-10X - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/06-c4742971.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Hjólagröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Stærsti hjólagröfuvagninn frá Gigant. Smíðaður fyrir 14 til 20 tonna hjólagröfur í 2-axla útgáfu. Afkastamikill í mjög krefjandi aðstæðunum.",
    "cardImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/06-c4742971.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "hjolagrofuvagn-gd3-6x",
    "slug": "hjolagrofuvagn-gd3-6x",
    "title": "Hjólagröfuvagn GD3-6X",
    "groupId": "hjolagrofuvagnar",
    "pageTitle": "Hjólagröfuvagn GD3-6X - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/04-2800ed53.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Hjólagröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Fyrir allt frá 10 tonna gröfum. Sérsmíðaður kassi úr Hardox 500 TUF, hálfmáni að framan, innfeldar hliðar og vökvavör að aftan gera auðvelt að bæði moka í og sturta úr vagninum.",
    "cardImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/04-2800ed53.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "hjolagrofuvagn-gd3-8x",
    "slug": "hjolagrofuvagn-gd3-8x",
    "title": "Hjólagröfuvagn GD3-8X",
    "groupId": "hjolagrofuvagnar",
    "pageTitle": "Hjólagröfuvagn GD3-8X - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/05-618fd2d3.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Hjólagröfuvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Hjólagröfuvagn sérhannaður fyrir hjólagröfur milli 14 og 20 tonna. Þetta módel er þekkt fyrir gæði og áreiðanleika og er okkar vinsælasta útfærsla.",
    "cardImage": {
      "src": "/images/sturtuvagnar__hjolagrofuvagnar/05-618fd2d3.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "landbunadarvagn-gd100",
    "slug": "landbunadarvagn-gd100",
    "title": "Landbúnaðarvagn GD100",
    "groupId": "landbunadarvagnar",
    "pageTitle": "Landbúnaðarvagn GD100 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar/05-468e8526.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Landbúnaðarvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "10 tonna sturtuvagn fyrir þá sem þurfa aðeins meira. Endingargóður og sterkbyggður vagn sem getur sinnt mörgum hlutverkum.",
    "cardImage": {
      "src": "/images/sturtuvagnar/05-468e8526.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "landbunadarvagn-gd125",
    "slug": "landbunadarvagn-gd125",
    "title": "Landbúnaðarvagn GD125",
    "groupId": "landbunadarvagnar",
    "pageTitle": "Landbúnaðarvagn GD125 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/05-8e7db8cb.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Landbúnaðarvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Þessi 12 tonna sturtuvagn sameinar fullkomna burðargetu, lengd, hæð og burðargetu til að koma til móts við kröfuharða bændur.",
    "cardImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/05-8e7db8cb.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "landbunadarvagn-gd140-gd140sb",
    "slug": "landbunadarvagn-gd140-gd140sb",
    "title": "Landbúnaðarvagn GD140 / GD140SB",
    "groupId": "landbunadarvagnar",
    "pageTitle": "Landbúnaðarvagn GD140 / GD140SB - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/06-ce0e3628.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Landbúnaðarvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Sterkbyggður og langur 14 tonna sturtuvagn sem kemur til bjargar þegar aðrir vagnar duga ekki til.",
    "cardImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/06-ce0e3628.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "landbunadarvagn-gd150",
    "slug": "landbunadarvagn-gd150",
    "title": "Landbúnaðarvagn GD150",
    "groupId": "landbunadarvagnar",
    "pageTitle": "Landbúnaðarvagn GD150 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/07-1b890124.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Landbúnaðarvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Það allra sterkasta sem Gigant framleiðir af landbúnaðarvögnum. Vagninn á myndinni er uppfærður með hækkuðum hliðum fyrir öruggan flutning á heyi.",
    "cardImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/07-1b890124.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "landbunadarvagn-gd85",
    "slug": "landbunadarvagn-gd85",
    "title": "Landbúnaðarvagn GD85",
    "groupId": "landbunadarvagnar",
    "pageTitle": "Landbúnaðarvagn GD85 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/03-220dd5a7.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Landbúnaðarvagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "8 tonna sturtuvagn sem er hannaður til að geta sinnt öllum helstu verkefnum í sveitinni.",
    "cardImage": {
      "src": "/images/sturtuvagnar__landbunadarvagnar/03-220dd5a7.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-gll4-18",
    "slug": "velavagn-gll4-18",
    "title": "Vélavagn GLL4-18",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn GLL4-18 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/06-b6580a67.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Tveggja öxla vagn með öllu því sem alvöru vagni ber að hafa. 20,5 tonna skráð burðargeta en þessi vagn getur léttilega borið meira en það.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/06-b6580a67.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-gll4-18l",
    "slug": "velavagn-gll4-18l",
    "title": "Vélavagn GLL4-18L",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn GLL4-18L - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/07-bf266b5d.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Lengri útgáfa af GLL4-18. Sami 40 mm eikarbotninn og 20 tonna burðargeta. Fullkominn vagn fyrir þá sem þurfa aðeins meira pláss.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/07-bf266b5d.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-gll4-24",
    "slug": "velavagn-gll4-24",
    "title": "Vélavagn GLL4-24",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn GLL4-24 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/08-09e513a1.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Sterkbyggður og afkastamikill vagn sem ber það sem þú þarft að flytja - og aðeins meira. Ramminn er smíðaður fyrir mun meira en það sem vagninn er skráður fyrir og gerður til að þola það sem þú setur á hann.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/08-09e513a1.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-gll4-27",
    "slug": "velavagn-gll4-27",
    "title": "Vélavagn GLL4-27",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn GLL4-27 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/09-346d121d.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "3 öxlar, 40mm eikarbotn, 8 metra langur, fullt af festipunktum og yfir 28 tonna burðargeta - hér er erfitt að finna eitthvað sem vantar.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/09-346d121d.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-ml160",
    "slug": "velavagn-ml160",
    "title": "Vélavagn ML160",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn ML160 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/04-c648de43.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Fullkominn vélavagn fyrir þá sem kunna að meta einfaldleika og skilvirkni. Með 16 tonna burðargetu og nóg af festipunktum er þetta vagn sem hentar vel í flest verk.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/04-c648de43.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-ml210",
    "slug": "velavagn-ml210",
    "title": "Vélavagn ML210",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn ML210 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/05-74778fd7.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Stærsti vélavagninn í ML seríunni af einfaldari vélavögnum. Stór og hagkvæmur vélavagn sem getur borið allt að 23 tonna þunga vél.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/05-74778fd7.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "velavagn-ml80",
    "slug": "velavagn-ml80",
    "title": "Vélavagn ML80",
    "groupId": "velaflutningavagnar",
    "pageTitle": "Vélavagn ML80 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/03-8f824b7e.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Vélaflutningavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Minnsti vélavagninn frá Gigant. Þessi lipri og netti vagn er fullkominn fyrir þá sem þurfa öflugann og stöðugan vagn í minni verkefni.",
    "cardImage": {
      "src": "/images/sturtuvagnar__velaflutningavagnar/03-8f824b7e.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "verktakavagn-gd3-13",
    "slug": "verktakavagn-gd3-13",
    "title": "Verktakavagn GD3-13",
    "groupId": "verktakavagnar",
    "pageTitle": "Verktakavagn GD3-13 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/03-3b32cbaa.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Verktakavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "þetta er minnsti verktakavagninn frá Gigant, en hér er ekkert sem vantar. 13 tonna burðargeta, sterkur staðalbúnaður og úrval af aukabúnaði veitir mikinn sveigjanleika.",
    "cardImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/03-3b32cbaa.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "verktakavagn-gd4-15",
    "slug": "verktakavagn-gd4-15",
    "title": "Verktakavagn GD4-15",
    "groupId": "verktakavagnar",
    "pageTitle": "Verktakavagn GD4-15 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/04-52c63e09.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Verktakavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Hinn fullkomni millivegur? GD4-15 er mest selgdi Gigant sturtuvagninn í þessari línu einkenndur af háu burðarþoli og lágri hæð.",
    "cardImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/04-52c63e09.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "verktakavagn-gd4-17",
    "slug": "verktakavagn-gd4-17",
    "title": "Verktakavagn GD4-17",
    "groupId": "verktakavagnar",
    "pageTitle": "Verktakavagn GD4-17 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/05-2b5a425a.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Verktakavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Afkastamikill sturtuvagn sem sinnir sínu bæði í fjöbreittum landbúnaðarverkum og við þunga flutninga.",
    "cardImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/05-2b5a425a.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "verktakavagn-gd4-17sb",
    "slug": "verktakavagn-gd4-17sb",
    "title": "Verktakavagn GD4-17SB",
    "groupId": "verktakavagnar",
    "pageTitle": "Verktakavagn GD4-17SB - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/06-11b07009.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Verktakavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Einstakur vagn sem sameinar hlutverk sturtuvagns og vélavagns. Hleðsluplan vagnsins færist 1,5 meter aftur svo hægt er að keyra upp á hann.",
    "cardImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/06-11b07009.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "verktakavagn-gd4-20",
    "slug": "verktakavagn-gd4-20",
    "title": "Verktakavagn GD4-20",
    "groupId": "verktakavagnar",
    "pageTitle": "Verktakavagn GD4-20 - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/07-2a595009.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Verktakavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Risa 2 öxla vagn sem fer létt með jafnvel mest krefjandi verekfnin. Vagninn er skráður með 19 tonna burðargetu en getur sturtað allt að 50 tonnum.",
    "cardImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/07-2a595009.jpg",
      "alt": "",
      "width": 1440,
      "height": 1440
    }
  },
  {
    "id": "verktakavagn-gd4-30hs",
    "slug": "verktakavagn-gd4-30hs",
    "title": "Verktakavagn GD4-30HS",
    "groupId": "verktakavagnar",
    "pageTitle": "Verktakavagn GD4-30HS - Skralli - Þinn samstarfsaðili",
    "description": "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
    "heroImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/08-5e05cfbf.jpg",
      "alt": "",
      "width": 1440,
      "height": 681
    },
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Verktakavagnar"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Tegundir í boði"
      }
    ],
    "images": [],
    "blurb": "Stærsti sturtuvagninn sem Gigant framleiðir. 30 tonna vagn sem hannaður er til að þola allt sem þú getur hugsað þér að setja í hann.",
    "cardImage": {
      "src": "/images/sturtuvagnar__verktakavagnar/08-5e05cfbf.jpg",
      "alt": "",
      "width": 1440,
      "height": 681
    }
  }
];

// The seven feature tiles from docs/scrape/sturtuvagnar.json's "Af hverju
// hjólagröfuvagn frá Gigant?" section — only the hjólagröfuvagnar group has
// these on the live site, so this is keyed by group slug/id and every other
// group is simply absent (no invented features for the other four groups).
export const groupFeatures: Record<string, GroupFeatures> = {
  "hjolagrofuvagnar": {
    "heading": "Af hverju hjólagröfuvagn frá Gigant?",
    "items": [
      "Sérhannað bremsukerfi",
      "Hardox 500 TUF",
      "Sveigður framgafl",
      "Vökvavör",
      "LED-ljós",
      "Verkfærakassi",
      "10 gata felgur"
    ]
  }
};
