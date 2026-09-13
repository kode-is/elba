import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import type { Img } from "@/lib/types";

type Product = { heading: string; text: string; image: Img };

const BUTTON_CLASSES =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid";

// docs/scrape/siubunadur.json blocks 21-44: six product rows, alternating
// image side and background band per docs/reference/siubunadur.desktop.jpg.
// Body text kept verbatim including the "―"-prefixed sub-lines and their
// irregular original spacing — these are plain text blocks in the scrape
// (no `list` annotation), so they're rendered with whitespace-pre-line
// instead of restructured into a <ul>. Image dimensions are the downloaded
// files' real pixel size (`sips -g pixelWidth -g pixelHeight`: all six are
// 940×1009), not the scrape's thumbnail-srcset size (390×418), so the
// `aspectRatio` box below matches each photo instead of distorting it under
// `object-contain`.
const PRODUCTS: Product[] = [
  {
    heading: "BMair Protector",
    text: "Þetta er grunnpakkinn í nýja kerfi BMair. BMair Protector er sjálfstæð eining sem veitir framúrskarandi ryksíun. \n    ―    Virkar bæði lárétt og lóðrétt \n    ―    Fyrir mjög rykug vinnuumhverfi",
    image: { src: "/images/siubunadur/03-d4358019.png", alt: "", width: 940, height: 1009 },
  },
  {
    heading: "BMair Protector Plus X",
    text: "BMair Protector Plus X er fullbúið loftsíukerfi fyrir hámarks ryk- og gassíun.    \n―    Hentar til áfestingar á þak vinnuvélar   \n ―    Fyrir mjög krefjandi vinnuumhverfi",
    image: { src: "/images/siubunadur/04-1dfe8cc8.png", alt: "", width: 940, height: 1009 },
  },
  {
    heading: "BMair MAO-3C Cab Guard",
    text: "Sérhannað fyrir vinnuumhverfi þar sem þörf er á sífellt snjallari kerfum. Í þessum fyrirferðalitla pakka er sérsniðin HEPA filter með óviðjafnanlega síunargetu.    \n―    Hentar til áfestingar á bretti eða hlífar vinnuvéla    \n―    Fyrir öll vinnuumhverfi",
    image: { src: "/images/siubunadur/05-15ce78e5.png", alt: "", width: 940, height: 1009 },
  },
  {
    heading: "BMair F20",
    text: "Fyrirferðalítið en öflugt loftsíunartæki sem hentar á flestar gerðir vinnuvéla. Þrátt fyrir netta stærð er það mikil síunargeta HEPA filtersins sem einkennir BMair F20.    \n―    Hentar til áfestingar á bretti eða hlífar vinnuvéla\n―    Fyrir öll vinnuumhverfi",
    image: { src: "/images/siubunadur/06-258363ea.png", alt: "", width: 940, height: 1009 },
  },
  {
    heading: "BMair F33",
    text: "BMair F33 gjörbylti baráttunni gegn skaðlegu lofti fyrir stjórnendur vinnuvéla með sínu stálhúsi hannað fyrir mest krefjandi aðstæður.\n    ―    Hentar til áfestingar á bretti eða hlífar\n    ―    Fyrir mjög krefjandi vinnuumhverfi",
    image: { src: "/images/siubunadur/07-7c6d1b13.png", alt: "", width: 940, height: 1009 },
  },
  {
    heading: "BMair F33-R",
    text: "BMair F33-R gjörbylti baráttunni gegn skaðlegu lofti fyrir stjórnendur vinnuvéla með sínu straumlínulagaða stálhúsi hannað fyrir þök vinnuvéla. \n    ―    Hentar til áfestingar á þak vinnuvélar\n    ―    Fyrir mjög krefjandi vinnuumhverfi",
    image: { src: "/images/siubunadur/08-5d01b6c5.png", alt: "", width: 940, height: 1009 },
  },
];

export function ProductsSection() {
  return (
    <>
      {PRODUCTS.map((product, index) => {
        const reversed = index % 2 === 1;
        return (
          <section key={product.heading} className={reversed ? "bg-[#f0f4fa]" : "bg-white"}>
            <Container className="grid items-center gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-16">
              <div
                className={`relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl${
                  reversed ? " md:order-2" : ""
                }`}
                style={{ aspectRatio: `${product.image.width} / ${product.image.height}` }}
              >
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-neutral-900 md:text-3xl">{product.heading}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600 md:text-base">
                  {product.text}
                </p>
                <Link href="/hafa-samband" className={`mt-6 ${BUTTON_CLASSES}`}>
                  Hafa samband
                </Link>
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
