import { ContactForm } from "@/components/ContactForm";

// docs/scrape/home.json block 68: the mini contact form's heading. Measured
// on live (Task 11, docs/measure.txt): the card is the cream surface tone
// with a 10px radius and 50px of padding, and the fields inside it are white
// — the inverse of /kontakt-oss, where cream fields sit on a white section.
export function ContactSection() {
  return (
    <div className="rounded-[10px] bg-surface p-6 md:p-[50px]">
      <h3 className="text-center font-ui text-card font-semibold text-black md:text-card-lg">Kontakt oss</h3>
      <div className="mt-6">
        <ContactForm submitLabel="Send" fieldTone="white" />
      </div>
    </div>
  );
}
