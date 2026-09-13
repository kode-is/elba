import Link from "next/link";
import { Container } from "@/components/Container";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/lib/categories";

/**
 * "Okkar vöruframboð" — measured on the live home page: section padding
 * 175 px above the heading (100 on mobile); heading 50/32 px Figtree 600;
 * square brand-dark button (16 px, padding 20×30) on desktop only, with the
 * one-line description right-aligned 30 px beneath it (on mobile the button
 * is hidden and the 15 px description sits 20 px under the heading); cards
 * 75 px below the header block (50 on mobile) in a 40 px grid.
 */
export function CategoriesSection() {
  const homeCategories = categories.filter((category) => category.onHome);

  return (
    <section className="bg-[#f0f4fa] pt-[100px] pb-16 md:pt-[175px] md:pb-[150px]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <h2 className="text-[32px] leading-[1.25] font-semibold text-neutral-900 md:text-[50px]">
            Okkar vöruframboð
          </h2>
          <div className="mt-5 flex flex-col md:mt-0 md:items-end">
            <Link
              href="/thjonusta"
              className="hidden w-fit items-center justify-center bg-brand-dark px-[30px] py-5 text-base leading-[1.2] font-semibold text-white transition hover:bg-brand-mid md:inline-flex"
            >
              Skoðaðu úrvalið
            </Link>
            <p className="text-right text-[15px] leading-[1.9] text-[#444] md:mt-[30px] md:text-lg">
              Við leggjum áherslu á vörugæði og framúrskarandi þjónustu.
            </p>
          </div>
        </div>

        <div className="mt-[50px] grid gap-10 sm:grid-cols-2 md:mt-[75px] lg:grid-cols-3">
          {homeCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
