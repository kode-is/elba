"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitContact } from "@/app/actions";
import { validateContact, type ContactPayload } from "@/lib/email/contact";

type ContactFormProps = {
  submitLabel: string;
  /**
   * Field background. Live uses cream fields on /kontakt-oss's white section
   * and white fields inside the home page's cream form card (both measured —
   * docs/measure.txt), so the two tones swap with the card around them.
   */
  fieldTone?: "cream" | "white";
};

const SUCCESS_TEXT = "Takk! Vi har mottatt henvendelsen din og svarer så snart vi kan.";

const FIELD_CLASS =
  "w-full rounded-[10px] border border-transparent px-5 py-5 text-[16px] text-black placeholder:text-ink-faint focus:border-brand focus:outline-none";

// Map validation error messages to field names for aria-invalid/aria-describedby
const ERROR_MESSAGE_TO_FIELD: Record<string, "navn" | "epost" | "melding"> = {
  "Vennligst fyll inn navn.": "navn",
  "Vennligst oppgi en gyldig e-postadresse.": "epost",
  "Vennligst skriv en melding.": "melding",
};

export function ContactForm({ submitLabel, fieldTone = "cream" }: ContactFormProps) {
  const fieldClass = `${FIELD_CLASS} ${fieldTone === "white" ? "bg-white" : "bg-surface"}`;
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [selskap, setSelskap] = useState("");
  const [melding, setMelding] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ContactPayload = { navn, epost, selskap, melding, website };
    const clientError = validateContact(payload);
    if (clientError) {
      setError(clientError);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitContact(payload);
      if (result.ok) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    });
  }

  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter(e.target.value);

  const errorField = error ? ERROR_MESSAGE_TO_FIELD[error] : null;

  if (success) {
    return (
      <div role="status" aria-live="polite">
        <p className="text-body-lg font-medium text-black">{SUCCESS_TEXT}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-navn" className="sr-only">
            Navn
          </label>
          <input
            id="contact-navn"
            name="name"
            type="text"
            placeholder="Navn"
            autoComplete="name"
            maxLength={120}
            value={navn}
            onChange={onChange(setNavn)}
            className={fieldClass}
            aria-invalid={errorField === "navn"}
            aria-describedby={errorField === "navn" ? "contact-error-message" : undefined}
          />
        </div>
        <div>
          <label htmlFor="contact-epost" className="sr-only">
            E-post
          </label>
          <input
            id="contact-epost"
            name="email"
            type="email"
            placeholder="E-post"
            autoComplete="email"
            maxLength={254}
            value={epost}
            onChange={onChange(setEpost)}
            className={fieldClass}
            aria-invalid={errorField === "epost"}
            aria-describedby={errorField === "epost" ? "contact-error-message" : undefined}
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-selskap" className="sr-only">
          Selskap
        </label>
        <input
          id="contact-selskap"
          name="company"
          type="text"
          placeholder="Selskap"
          autoComplete="organization"
          maxLength={120}
          value={selskap}
          onChange={onChange(setSelskap)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-melding" className="sr-only">
          Melding
        </label>
        <textarea
          id="contact-melding"
          name="message"
          placeholder="Melding"
          rows={5}
          maxLength={5000}
          value={melding}
          onChange={onChange(setMelding)}
          className={fieldClass}
          aria-invalid={errorField === "melding"}
          aria-describedby={errorField === "melding" ? "contact-error-message" : undefined}
        />
      </div>
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">Nettside (ikke fyll ut)</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={website}
          onChange={onChange(setWebsite)}
        />
      </div>
      <div role="status" aria-live="polite" className="min-h-[1.5rem]">
        {error ? <p id="contact-error-message" className="text-body-lg font-medium text-red-600">{error}</p> : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[10px] bg-brand px-6 py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sender..." : submitLabel}
      </button>
    </form>
  );
}
