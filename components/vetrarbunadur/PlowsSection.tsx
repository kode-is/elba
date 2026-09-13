import Image from "next/image";
import { Container } from "@/components/Container";
import { BulletList } from "@/components/BulletList";
import type { Img } from "@/lib/types";

// docs/scrape/vetrarbunadur.json blocks 25-53.
const PLOWS_IMAGE: Img = { src: "/images/vetrarbunadur/02-c1a583fc.webp", alt: "", width: 1440, height: 681 };
const LSV_IMAGE: Img = { src: "/images/vetrarbunadur/03-3c6d3d08.jpg", alt: "", width: 1440, height: 1440 };
const HSV_IMAGE: Img = { src: "/images/vetrarbunadur/04-b60cdacb.webp", alt: "", width: 1440, height: 1440 };

const LSV_ACCESSORIES = [
  "Volvo BM krókar",
  "L-30 krókar (minni Volvo BM krókar)",
  "2 x blikkljós",
  "2x LED ljós á hornum",
  "2x stoðfætur með hringlaga plöttum til að fylgja eftir landslagi",
  "Superswing - Hægt sé að stilla plóg sem skekkjanlegt beint blað",
  "Stjórnbox fyrir superswing",
  "2x akkúmulatorar sem gefa eftir ef lent er á föstu. (Ekki hægt með superwing)",
];

const HSV_STANDARD = [
  "3ja punkta festing",
  "Superswing - Hægt sé að stilla plóg sem skekkjanlegt beint blað",
  "2x LED ljós á hornum",
];

const HSV_ACCESSORIES = [
  "Stjórnbox fyrir superswing",
  "Volvo BM krókar",
  "L-30 krókar (minni Volvo BM krókar)",
  "2 x blikkljós",
  "2 x stoðfætur með hringlaga plöttum til að fylgja eftir landslagi",
];

function ImageBlock({ image }: { image: Img }) {
  return (
    <div
      className="relative mt-8 w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 60vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export function PlowsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container className="max-w-3xl">
        <h3 className="font-ui text-2xl font-semibold text-neutral-900 md:text-3xl">Snjóplógar</h3>
        <ImageBlock image={PLOWS_IMAGE} />
        <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">
          Gigant býður upp á tvær týpur af fjölplógum, HSV og LSV. Sammerkt með þeim báðum er
          útsláttarbúnaður á skerablaði er úr HARDOX ásamt því að allir boltar og öxlar eru úr
          ryðfríu stáli. LSV er fyrir minni vélar, nettur og þægilegur og hægt að fá með sama
          búnaði og stærri HSV plógarnir.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
          HSV kemur með öllu því sem verktakinn óskar sér og hentar til dæmis vel á stóra traktóra
          og milli og meðalstórar hjólaskóflur.
        </p>

        <h5 className="mt-10 font-ui text-lg font-semibold text-neutral-900">LSV fjölplógur</h5>
        <ImageBlock image={LSV_IMAGE} />
        <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">
          LSV er 91,5 cm á hæð og kemur í breiddunum 200cm, 250cm og 280cm. Eru með veltibúnaði og
          30 gráðu vinnuvinkil á vængjum. 3ja punkta og SMS festing hluti af staðalbúnaði.
        </p>
        <p className="mt-4 text-sm font-semibold text-neutral-900">Fáanlegur aukabúnaður:</p>
        <BulletList items={LSV_ACCESSORIES} className="mt-3" />

        <h5 className="mt-10 font-ui text-lg font-semibold text-neutral-900">Snjóplógur HSV</h5>
        <ImageBlock image={HSV_IMAGE} />
        <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">
          HSV er 122 cm á hæð og kemur í breiddunum 280cm, 320cm og 360cm. Þessir plógar eru með
          veltibúnað og 35 gráðu vinnuvinkil á vængjum. HSV er gerður til þess að standast
          væntingar jafnvel kröfuhörðustu verktaka.
        </p>
        <p className="mt-4 text-sm font-semibold text-neutral-900">Staðalbúnaður:</p>
        <BulletList items={HSV_STANDARD} className="mt-3" />
        <p className="mt-6 text-sm font-semibold text-neutral-900">Fáanlegur aukabúnaður:</p>
        <BulletList items={HSV_ACCESSORIES} className="mt-3" />
      </Container>
    </section>
  );
}
