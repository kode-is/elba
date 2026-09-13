import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

// docs/scrape/404.json — same site-wide <title>/<meta description> as every
// other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/404",
});

export default function NotFound() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/404/01-d1eed4a4.jpg",
          alt: "Leikfangavinnuvélar og grjót í sandkassaleik",
          width: 1440,
          height: 959,
        }}
        height="min-h-screen"
        overlayClassName="bg-black/55"
        contentClassName="flex flex-col items-center gap-6 px-6 text-center text-white"
      >
        <h1 className="text-7xl font-semibold md:text-8xl">404</h1>
        <h2 className="max-w-xl text-lg font-medium md:text-xl">
          Síðan sem þú ert að leita að er ekki til eða hefur verið færð. Vinsamlegast farðu
          aftur á heimasíðuna.
        </h2>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-md border border-white px-8 py-3 text-sm font-semibold transition hover:bg-white hover:text-neutral-900"
        >
          Heim
        </Link>
      </PageHero>
    </main>
  );
}
