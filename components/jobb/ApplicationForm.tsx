"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitApplication } from "@/app/actions";
import { validateApplication, type ApplicationPayload } from "@/lib/email/application";

const SUCCESS_TEXT = "Takk! Vi har mottatt søknaden din og ringer deg så snart vi kan.";

// Visible labels (not sr-only placeholders like ContactForm): most people
// reach this form from a QR code on a phone, where a label that vanishes
// as you type is the first thing to trip over.
const LABEL_CLASS = "mb-2 block font-ui text-body-lg font-semibold text-black";
const FIELD_CLASS =
  "w-full rounded-[10px] border border-transparent bg-white px-5 py-4 text-[16px] text-black placeholder:text-ink-faint focus:border-brand focus:outline-none";

type Field = "navn" | "telefon" | "epost";
const ERROR_TO_FIELD: Record<string, Field> = {
  "Vennligst fyll inn navn.": "navn",
  "Vennligst oppgi et gyldig telefonnummer.": "telefon",
  "Vennligst oppgi en gyldig e-postadresse.": "epost",
};

export function ApplicationForm() {
  const [navn, setNavn] = useState("");
  const [telefon, setTelefon] = useState("");
  const [epost, setEpost] = useState("");
  const [melding, setMelding] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ApplicationPayload = { navn, telefon, epost, melding, website };
    const clientError = validateApplication(payload);
    if (clientError) {
      setError(clientError);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitApplication(payload);
      if (result.ok) setSuccess(true);
      else setError(result.error);
    });
  }

  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter(e.target.value);
  const errorField = error ? ERROR_TO_FIELD[error] : undefined;
  const invalid = (field: Field) => ({
    "aria-invalid": errorField === field,
    "aria-describedby": errorField === field ? "application-error" : undefined,
  });

  if (success) {
    return (
      <div role="status" aria-live="polite" className="rounded-[20px] bg-white p-8">
        <p className="text-body-lg font-medium text-black">{SUCCESS_TEXT}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="application-navn" className={LABEL_CLASS}>
            Navn
          </label>
          <input
            id="application-navn"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={navn}
            onChange={onChange(setNavn)}
            className={FIELD_CLASS}
            {...invalid("navn")}
          />
        </div>
        <div>
          <label htmlFor="application-telefon" className={LABEL_CLASS}>
            Telefon
          </label>
          <input
            id="application-telefon"
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            value={telefon}
            onChange={onChange(setTelefon)}
            className={FIELD_CLASS}
            {...invalid("telefon")}
          />
        </div>
      </div>
      <div>
        <label htmlFor="application-epost" className={LABEL_CLASS}>
          E-post <span className="font-normal text-ink-muted">(valgfritt)</span>
        </label>
        <input
          id="application-epost"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={epost}
          onChange={onChange(setEpost)}
          className={FIELD_CLASS}
          {...invalid("epost")}
        />
      </div>
      <div>
        <label htmlFor="application-melding" className={LABEL_CLASS}>
          Litt om deg <span className="font-normal text-ink-muted">(valgfritt)</span>
        </label>
        <textarea
          id="application-melding"
          name="message"
          rows={4}
          maxLength={5000}
          placeholder="Erfaring, fagbrev, hvor du bor …"
          value={melding}
          onChange={onChange(setMelding)}
          className={FIELD_CLASS}
        />
      </div>
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="application-website">Nettside (ikke fyll ut)</label>
        <input
          id="application-website"
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={website}
          onChange={onChange(setWebsite)}
        />
      </div>
      <div role="status" aria-live="polite" className="min-h-[1.5rem]">
        {error ? (
          <p id="application-error" className="text-body-lg font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[10px] bg-brand px-6 py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sender..." : "Send søknad"}
      </button>
    </form>
  );
}
