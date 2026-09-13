import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "Hvert år leverer vi sentralsmøreanlegg til mange tusen smørepunkter, enten montert av egne montører eller hvor du selv setter opp systemet.",
  path: "/404",
});

export default function NotFound() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/404/01-placeholder.jpg",
          alt: "",
          width: 1440,
          height: 960,
        }}
        height="min-h-screen"
        overlayClassName="bg-black/55"
        contentClassName="flex flex-col items-center gap-6 px-6 text-center text-white"
      >
        <h1 className="text-7xl font-semibold md:text-8xl">404</h1>
        <h2 className="max-w-xl text-lg font-medium md:text-xl">
          Siden du leter etter finnes ikke eller har blitt flyttet. Vennligst gå tilbake til
          forsiden.
        </h2>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-md border border-white px-8 py-3 text-sm font-semibold transition hover:bg-white hover:text-neutral-900"
        >
          Hjem
        </Link>
      </PageHero>
    </main>
  );
}
