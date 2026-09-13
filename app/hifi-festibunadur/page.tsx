import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { ChildCards, type ChildCard } from "@/components/hifi/ChildCards";

// docs/scrape/hifi-festibunadur.json — same <title>/<meta description> as
// every other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/hifi-festibunadur",
});

// docs/scrape/hifi-festibunadur.json block 1: same photo as the home page's
// hífi- & festibúnaður category card (lib/categories.ts),
// scraped at a 418x512 thumbnail; the actual downloaded file is 2825x3460
// (same aspect ratio), so that's what's passed to next/image — same
// small-thumbnail-distortion fix as the /oryggisrudur and /smurkerfi heroes
// (see components/smurkerfi's HERO_IMAGE comment).
const HERO_IMAGE = {
  src: "/images/home/25-cf51054e.png",
  alt: "Hífibúnaður og keðjur á sýningarvegg Lilleseth",
  width: 2825,
  height: 3460,
};

const LILLESETH_IMAGE = {
  src: "/images/hifi-festibunadur/02-bf8db647.webp",
  alt: "",
  width: 1200,
  height: 1372,
};

const CHILD_CARDS: ChildCard[] = [
  {
    href: "/hifi-festibunadur/hifikedjur",
    title: "Hífikeðjur",
    image: { src: "/images/hifi-festibunadur/03-9bc801b8.jpg", alt: "", width: 386, height: 135 },
  },
  {
    href: "/hifi-festibunadur/bindikedjur-strekkjarar",
    title: "Bindikeðjur og strekkjarar",
    image: { src: "/images/hifi-festibunadur/04-dd0c6f76.png", alt: "", width: 386, height: 377 },
  },
  {
    href: "/hifi-festibunadur/aukabunadur",
    title: "Aukabúnaður til hífinga",
    image: { src: "/images/hifi-festibunadur/05-865d4540.jpg", alt: "", width: 386, height: 135 },
  },
  {
    href: "/hifi-festibunadur/stroffur",
    title: "Stroffur",
    image: { src: "/images/hifi-festibunadur/06-1c399280.jpg", alt: "", width: 386, height: 135 },
  },
  {
    href: "/hifi-festibunadur/bordastrekkjarar",
    title: "Borðastrekkjarar",
    image: { src: "/images/hifi-festibunadur/07-d5932744.jpg", alt: "", width: 386, height: 135 },
  },
];

const HifiIcon = CATEGORY_ICONS["hifi-festibunadur"];

export default function HifiFestibunadurPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Hífi- & festibúnaður"
        subtitle="Vottaður hífi- og festibúnaður sem uppfyllir öll skilyrði um öryggi og endingu"
        icon={HifiIcon ? <HifiIcon className="h-6 w-6" /> : null}
        pattern
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb items={[{ text: "Hífi- & festibúnaður" }]} />
        </Container>
      </div>
      <section className="bg-white py-10 md:py-14">
        <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Lyftu þungt með Lilleseth.</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">
              Skralli er með gott úrval af viðurkenndum hífibúnaði frá Lilleseth Kjetting AS. Keðjur með Grade 80
              og Grade 100 og margt fleira.
            </p>
            <Link
              href="/hafa-samband"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid"
            >
              Hafa samband
            </Link>
          </div>
          <div
            className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl"
            style={{ aspectRatio: `${LILLESETH_IMAGE.width} / ${LILLESETH_IMAGE.height}` }}
          >
            <Image
              src={LILLESETH_IMAGE.src}
              alt={LILLESETH_IMAGE.alt}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
      <section className="bg-white pb-10 md:pb-14">
        <Container>
          <ChildCards items={CHILD_CARDS} />
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
