// Product categories scraped verbatim from docs/scrape/home.json (blocks 43-66)
// and docs/scrape/thjonusta.json (Vetrarbúnaður, blocks 30-33).
// Order matches both the home page's "Okkar vöruframboð" grid and the
// /thjonusta index (which appends Vetrarbúnaður at the end).

import type { Img } from "./types";

export type Category = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  image: Img;
  /** Shown in the home page's six-card grid. */
  onHome: boolean;
};

export const categories: Category[] = [
  {
    id: "siubunadur",
    title: "Síubúnaður",
    blurb: "Lofthreinsitæki frá BMair - bylting í heilbrigðu vinnuumhverfi",
    href: "/siubunadur",
    image: { src: "/images/home/21-212e4fb5.png", alt: "", width: 512, height: 238 },
    onHome: true,
  },
  {
    id: "smurkerfi",
    title: "Smurkerfi",
    blurb: "BEKA-MAX og Groeneveld smurkerfi í allar tegundir tækja og iðnað",
    href: "/smurkerfi",
    image: { src: "/images/home/22-d2d92984.jpeg", alt: "Smurkerfi", width: 512, height: 473 },
    onHome: true,
  },
  {
    id: "sturtuvagnar",
    title: "Sturtuvagnar",
    blurb: "Slitsterkir sturtuvagnar framleiddir í Noregi og með 5 ára ábyrgð",
    href: "/sturtuvagnar",
    image: {
      src: "/images/home/23-16722dae.jpeg",
      alt: "Traktor að losa svartan Gigant sturtuvagn í snjó",
      width: 512,
      height: 341,
    },
    onHome: true,
  },
  {
    id: "oryggisrudur",
    title: "Öryggisrúður",
    blurb: "Óbrjótanlegar og eldhamlandi rúður sem þola erfiðustu aðstæður",
    href: "/oryggisrudur",
    image: {
      src: "/images/home/24-a996c2c4.jpg",
      alt: "Starfsmaður Skralla að setja upp Hammerglass-rúðu",
      width: 512,
      height: 384,
    },
    onHome: true,
  },
  {
    id: "hifi-festibunadur",
    title: "Hífi- & festibúnaður",
    blurb: "Vottaður hífi- og festibúnaður sem uppfyllir öll skilyrði um öryggi og endingu",
    href: "/hifi-festibunadur",
    image: {
      src: "/images/home/25-cf51054e.png",
      alt: "Hífibúnaður og keðjur á sýningarvegg Lilleseth",
      width: 418,
      height: 512,
    },
    onHome: true,
  },
  {
    id: "fyrirokumannin",
    title: "Fyrir ökumanninn",
    blurb: "Sætisáklæði, gólfmottur, ljósabúnaður og fleira - sérsniðið að þínu tæki",
    href: "/fyrirokumannin",
    image: { src: "/images/home/26-94902b25.jpeg", alt: "Sætisáklæði", width: 512, height: 683 },
    onHome: true,
  },
  {
    id: "vetrarbunadur",
    title: "Vetrarbúnaður",
    blurb: "Snjókeðjur, snjóplógar og vængjaskóflur í miklu úrvali",
    href: "/vetrarbunadur",
    image: { src: "/images/thjonusta/08-e6009210.jpeg", alt: "", width: 384, height: 512 },
    onHome: false,
  },
];
