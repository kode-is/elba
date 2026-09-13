import Link from "next/link";
import { Container } from "@/components/Container";
import { DotDivider } from "@/components/DotDivider";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

const BUTTON_CLASSES =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid";

// docs/scrape/siubunadur.json blocks 7-9. The live page embeds a YouTube
// player in this section — not captured as a scrape block (the block
// scraper doesn't pick up <iframe>s) but confirmed by docs/scrape/
// inline-svg.json, whose play-glyph SVG (hash 3425485f) has this exact
// heading/paragraph as its "nearbyText", and by a live fetch of
// https://skralli.is/siubunadur: `<iframe src="https://www.youtube.com/
// embed/K1e7uMqRDRw?v=K1e7uMqRDRw">`. Placed left of the text per
// docs/reference/siubunadur.desktop.jpg.
export function IntroSection() {
  return (
    <section className="bg-white pt-10 md:pt-14">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <YouTubeEmbed videoId="K1e7uMqRDRw" params="v=K1e7uMqRDRw" title="Síubúnaður frá BMair" />
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
            Fyrir heilbrigt vinnuumhverfi
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Lofthreinsitæki frá BMair tryggja hreint og heilnæmt andrúmsloft með því að fjarlægja úr
            loftinu ýmis skaðleg efni eins og ryk, frjókorn, myglugró, bakteríur og önnur mengandi
            efni. Við bjóðum einnig upp á margar tegundir filtera fyrir mismunandi þarfir, svo sem
            HEPA síur, kolsíur og aðrar sérhæfðar síur sem tryggja að loftgæðin séu alltaf í hámarki.
          </p>
          <Link href="/hafa-samband" className={`mt-6 ${BUTTON_CLASSES}`}>
            Hafa samband
          </Link>
        </div>
      </Container>

      {/* docs/scrape/siubunadur.json block 10. */}
      <DotDivider className="mt-[60px]" />
    </section>
  );
}
