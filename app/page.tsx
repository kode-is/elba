import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "Hvert år leverer vi sentralsmøreanlegg til mange tusen smørepunkter, enten montert av egne montører eller hvor du selv setter opp systemet.",
  path: "/",
});

export default function Home() {
  return (
    <main id="main">
      <h1>ELBA</h1>
    </main>
  );
}
