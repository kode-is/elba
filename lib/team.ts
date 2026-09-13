import type { Img } from "@/lib/types";

export type TeamMember = { name: string; role: string; email: string; phone?: string; image: Img };

// docs/scrape/om-oss.json blocks 28-64 ("Vårt team"), first-seen order —
// the live markup repeats every card once for desktop and once for mobile
// and this is the order the first occurrence of each name appears in. All
// nine members share the same placeholder avatar image on the live site
// (block's `local` is "/images/om-oss/06-ccdd026b.png", 512x512, for every
// member) rather than individual headshots.
const AVATAR: Img = { src: "/images/om-oss/06-ccdd026b.png", alt: "", width: 512, height: 512 };

export const team: TeamMember[] = [
  { name: "Ronny Thoresen", role: "Daglig leder", email: "ronny@elba.no", image: AVATAR },
  { name: "Haavard Gaathaug", role: "Salgsingeniør", email: "haavard@elba.no", image: AVATAR },
  { name: "Hege Hersæther", role: "Driftsleder", email: "hege@elba.no", image: AVATAR },
  { name: "Adrian Myrvold", role: "Logistikk og salg", email: "adrian@elba.no", image: AVATAR },
  { name: "Lukas Sundby Baklid", role: "Logistikk", email: "lager@elba.no", image: AVATAR },
  { name: "H. Isak Vilmundarson", role: "Prosjektleder", email: "isak@elba.no", image: AVATAR },
  { name: "Christoffer Iversen", role: "Senior montør", email: "christoffer@elba.no", phone: "776 4836", image: AVATAR },
  { name: "Sondre Hovde Bamrud", role: "Senior montør", email: "sondre@elba.no", image: AVATAR },
  { name: "Eva Hansen", role: "Regnskap", email: "eva@elba.no", image: AVATAR },
];
