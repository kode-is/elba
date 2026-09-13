import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";

// docs/scrape/smurkerfi.json blocks 35-40 (Q/A pairs as alternating text
// blocks — the question ends with "?" and the next block is its answer).
const ITEMS = [
  {
    question: "Hvaða feiti á að nota í smurkerfi?",
    answer:
      "Skralli mælir með MAX-2-LUBE (NLG2) koppafeiti fyrir flest notkunarsvið - í smurkerfi sem og smursprautur.\nFyrir fleyga mælum við með MAX-2-LUBE fleygafeiti.",
  },
  {
    question: "Þjónustið þið smurkerfi frá öðrum framleiðendum?",
    answer:
      "Við erum sérfræðingar í smurkerfum og veitum fyrsta flokks þjónustu og ráðgjöf alveg óháð framleiðanda. Við eigum stórt úrval af varahlutum á lager fyrir flestar gerðir smurkerfa en sérhæfum okkur í Groeneveld-BEKA.",
  },
  {
    question: "Má nota sömu feiti á mismunandi kerfi (Beka, Groeneveld eða Lincoln)?",
    answer:
      "Já! MAX-2-LUBE er koppafeiti með einstaklega mikla viðloðun - sem er nákvæmlega það sem smurkerfi vilja. Hana má nota í öll smurkerfi alveg óháð framleiðanda.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-[#f0f4fa] pt-[60px] pb-16 md:pt-[100px] md:pb-20">
      <Container>
        <h2 className="text-center font-ui text-3xl font-bold text-neutral-900 md:text-4xl">
          Spurt & Svarað
        </h2>
        <div className="mx-auto mt-10 max-w-3xl">
          <Faq items={ITEMS} />
        </div>
      </Container>
    </section>
  );
}
