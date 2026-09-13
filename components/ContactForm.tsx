"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitContact } from "@/app/actions";
import { validateContact, type ContactPayload } from "@/lib/email/contact";

type ContactFormProps = {
  submitLabel: string;
};

const SUCCESS_TEXT = "Takk! Vi har mottatt henvendelsen din og svarer så snart vi kan.";

const fieldClass =
  "w-full rounded-md border border-transparent bg-surface px-4 py-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand focus:outline-none";

// Map validation error messages to field names for aria-invalid/aria-describedby
const ERROR_MESSAGE_TO_FIELD: Record<string, "navn" | "epost" | "melding"> = {
  "Vennligst fyll inn navn.": "navn",
  "Vennligst oppgi en gyldig e-postadresse.": "epost",
  "Vennligst skriv en melding.": "melding",
};

export function ContactForm({ submitLabel }: ContactFormProps) {
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
        <p className="text-sm font-medium text-neutral-900">{SUCCESS_TEXT}</p>
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
        {error ? <p id="contact-error-message" className="text-sm font-medium text-red-600">{error}</p> : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sender..." : submitLabel}
      </button>
    </form>
  );
}
