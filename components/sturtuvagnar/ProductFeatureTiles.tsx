import { Container } from "@/components/Container";

// design.dc.html 1e "Hjólagröfuvagnar — 7 eiginleikaflísar": a restyled
// feature-tile grid for product pages only.
//
// This is a SEPARATE component from FeatureTiles.tsx, not a restyle of it,
// even though the brief's ruling describes restyling FeatureTiles.tsx
// directly and dropping its `desktopColumns` prop. FeatureTiles.tsx turned
// out to also be the component behind FeaturesSection.tsx, which renders
// this same groupFeatures data on the /sturtuvagnar CATEGORY page (outside
// this redesign's route file) — restyling it in place would have changed
// that unrelated, live-site-verified page's look (plain white tiles, no
// numbering, 3-column desktop grid) as a side effect. Keeping it untouched
// and adding this new component instead satisfies "restyle the product
// page's tiles" without touching a page outside app/sturtuvagnar/[slug].
//
// Numbered "01".."07" (zero-padded); the last tile always fills the
// remainder of its row (2-col mobile, 4-col desktop) — the 4+3 desktop /
// 2×3+1 mobile layout in the design. No top padding of its own: FactStrip
// + ProductIntro's own bottom padding is the gap above this section.
export function ProductFeatureTiles({ heading, items }: { heading: string; items: string[] }) {
  const lastIndex = items.length - 1;

  return (
    <section className="bg-white pb-[100px]">
      <Container>
        <h2 className="mb-6 text-[32px] font-semibold text-[#171717] md:mb-11 md:text-[50px]">{heading}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item}
              className={`flex min-h-[120px] flex-col justify-between rounded-[15px] border border-[#E3E9F2] bg-white p-[22px] ${
                index === lastIndex ? "col-span-2" : ""
              }`}
            >
              <span className="font-ui text-xs font-semibold text-brand-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-ui text-base font-semibold text-[#171717]">{item}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
