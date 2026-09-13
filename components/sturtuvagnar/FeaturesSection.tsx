import { FeatureTiles } from "@/components/sturtuvagnar/FeatureTiles";
import { groupFeatures } from "@/lib/sturtuvagnar";

// docs/scrape/sturtuvagnar.json blocks 14-20: H2 "Af hverju hjólagröfuvagn
// frá Gigant?" followed by seven H3s with no body text or images in the
// scrape (docs/reference/sturtuvagnar.desktop.jpg shows them as a 3-column
// grid of plain white tiles — 7 items -> 2 full rows + a lone third-row
// tile). scripts/gen-sturtuvagnar.mjs parses that same section into
// lib/sturtuvagnar.ts's `groupFeatures.hjolagrofuvagnar`, which product
// pages in that group also render (components/sturtuvagnar/FeatureTiles.tsx)
// — reused here instead of a second hardcoded copy of the same seven items.
const FEATURES = groupFeatures.hjolagrofuvagnar;

export function FeaturesSection() {
  return <FeatureTiles heading={FEATURES.heading} items={FEATURES.items} />;
}
