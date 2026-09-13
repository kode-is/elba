import { Container } from "@/components/Container";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

// docs/scrape/fyrirokumannin.json blocks 81-83. The live page embeds a
// YouTube player in this section — not captured as a scrape block (the
// block scraper doesn't pick up <iframe>s) but confirmed by docs/scrape/
// inline-svg.json, whose play-glyph SVG (hash 3425485f) sits right before
// the ContactCta section in the DOM here, and by a live fetch of
// https://skralli.is/fyrirokumannin: `<iframe src="https://www.youtube.com/
// embed/rbGL9zYsKck?iv_load_policy=3">`. Placed right of the text per
// docs/reference/fyrirokumannin.desktop.jpg.
export function LightingSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Ljósabúnaður</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Sérsniðnir ljósabogar frá Svíþjóð fyrir hús og ballest á vinnuvélar og dráttarvélar.
          </p>
          <p className="mt-4 text-sm font-semibold text-neutral-900">
            Hafðu samband til að vita meira um úrvalið fyrir þína vél.
          </p>
        </div>
        <YouTubeEmbed videoId="rbGL9zYsKck" params="iv_load_policy=3" title="Ljósabúnaður fyrir vinnuvélar og dráttarvélar" />
      </Container>
    </section>
  );
}
