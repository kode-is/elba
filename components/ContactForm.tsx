"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitContact } from "@/app/actions";
import { validateContact, type ContactPayload } from "@/lib/email/contact";

type ContactFormProps = {
  /** The live /hafa-samband form has a phone field; the home page one doesn't. */
  showPhone?: boolean;
  submitLabel: string;
  /**
   * Prefills the message field (e.g. a product inquiry card's "Fyrirspurn um
   * <product>" default) — the visitor can still edit or clear it like any
   * other field, it's just the textarea's initial value.
   */
  defaultMessage?: string;
  /**
   * "default" (the only variant that existed before) renders exactly as
   * before — verified byte-for-byte against the live home page and
   * /hafa-samband, so its branch below must never change. "card" is the
   * product-redesign's inquiry-card styling (design.dc.html 1a/1d): visible
   * labels, filled/focus-ring inputs, a square full-width submit button,
   * and an inline error under the invalid field instead of a bottom-only
   * message.
   */
  variant?: "default" | "card";
};

const SUCCESS_TEXT =
  "Takk fyrir! Við höfum móttekið fyrirspurnina og svörum innan 1 klst á opnunartíma.";

const fieldClass =
  "w-full rounded-md border border-transparent bg-[#f0f4fa] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-dark focus:outline-none";

// Map validation error messages to field names for aria-invalid/aria-describedby
const ERROR_MESSAGE_TO_FIELD: Record<string, "nafn" | "netfang" | "skilabod"> = {
  "Vinsamlegast fylltu út nafn.": "nafn",
  "Vinsamlegast sláðu inn gilt netfang.": "netfang",
  "Vinsamlegast skrifaðu skilaboð.": "skilabod",
};

const CARD_LABEL_CLASS = "mb-1.5 block font-ui text-xs font-semibold text-[#171717]";

const CARD_FIELD_BASE =
  "w-full rounded-md border bg-[#F0F4FA] font-ui text-[15px] text-[#171717] placeholder:text-neutral-500 outline-none focus:border-brand-mid focus:bg-white focus:ring-[3px] focus:ring-brand-mid/[.18]";

function cardFieldClass(hasError: boolean, extra: string) {
  return `${CARD_FIELD_BASE} ${extra} ${hasError ? "border-[#C0392B] bg-[#FFF7F7]" : "border-[#E3E9F2]"}`;
}

export function ContactForm({
  showPhone = false,
  submitLabel,
  defaultMessage,
  variant = "default",
}: ContactFormProps) {
  const [nafn, setNafn] = useState("");
  const [netfang, setNetfang] = useState("");
  const [simi, setSimi] = useState("");
  const [skilabod, setSkilabod] = useState(defaultMessage ?? "");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ContactPayload = { nafn, netfang, simi, skilabod, website };
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
    if (variant === "card") {
      return (
        <div role="status" aria-live="polite">
          <div
            aria-hidden="true"
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6F0] font-ui text-lg font-bold text-accent-green"
          >
            ✓
          </div>
          <h3 className="font-sans text-[22px] font-semibold text-[#171717]">Fyrirspurn móttekin</h3>
          <p className="mt-2 font-ui text-[13px] leading-[1.55] text-[#444444]">{SUCCESS_TEXT}</p>
        </div>
      );
    }
    return (
      <div role="status" aria-live="polite">
        <p className="text-sm font-medium text-neutral-900">{SUCCESS_TEXT}</p>
      </div>
    );
  }

  if (variant === "card") {
    // The bottom live region stays mounted at all times (so screen readers
    // keep hearing updates the same way the default variant's does) but is
    // visually hidden whenever the current error is field-specific, because
    // that message is duplicated — visibly, decoratively — right under the
    // offending field instead.
    const hasFieldError = Boolean(errorField);

    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="contact-nafn" className={CARD_LABEL_CLASS}>
              Nafn
            </label>
            <input
              id="contact-nafn"
              name="name"
              type="text"
              autoComplete="name"
              value={nafn}
              onChange={onChange(setNafn)}
              className={cardFieldClass(errorField === "nafn", "h-[46px] px-3.5")}
              aria-invalid={errorField === "nafn"}
              aria-describedby={errorField === "nafn" ? "contact-error-message" : undefined}
            />
            {errorField === "nafn" ? (
              <p aria-hidden="true" className="mt-1.5 font-ui text-xs font-medium text-[#C0392B]">
                {error}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="contact-netfang" className={CARD_LABEL_CLASS}>
              Netfang
            </label>
            <input
              id="contact-netfang"
              name="email"
              type="email"
              autoComplete="email"
              value={netfang}
              onChange={onChange(setNetfang)}
              className={cardFieldClass(errorField === "netfang", "h-[46px] px-3.5")}
              aria-invalid={errorField === "netfang"}
              aria-describedby={errorField === "netfang" ? "contact-error-message" : undefined}
            />
            {errorField === "netfang" ? (
              <p aria-hidden="true" className="mt-1.5 font-ui text-xs font-medium text-[#C0392B]">
                {error}
              </p>
            ) : null}
          </div>
        </div>
        {showPhone ? (
          <div>
            <label htmlFor="contact-simi" className={CARD_LABEL_CLASS}>
              Símanúmer
            </label>
            <input
              id="contact-simi"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              value={simi}
              onChange={onChange(setSimi)}
              className={cardFieldClass(false, "h-[46px] px-3.5")}
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="contact-skilabod" className={CARD_LABEL_CLASS}>
            Skilaboð
          </label>
          <textarea
            id="contact-skilabod"
            name="message"
            rows={4}
            value={skilabod}
            onChange={onChange(setSkilabod)}
            className={cardFieldClass(errorField === "skilabod", "h-[92px] resize-none px-3.5 py-3")}
            aria-invalid={errorField === "skilabod"}
            aria-describedby={errorField === "skilabod" ? "contact-error-message" : undefined}
          />
          {errorField === "skilabod" ? (
            <p aria-hidden="true" className="mt-1.5 font-ui text-xs font-medium text-[#C0392B]">
              {error}
            </p>
          ) : null}
        </div>
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="contact-website">Vefsíða (ekki fylla út)</label>
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
        <div role="status" aria-live="polite" className={hasFieldError ? "sr-only" : "min-h-[1.5rem]"}>
          {error ? (
            <p id="contact-error-message" className="font-ui text-xs font-medium text-[#C0392B]">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-none bg-brand-dark px-[30px] py-5 text-base font-semibold text-white transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Sendi..." : submitLabel}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/*
        The live /hafa-samband form (the wide, showPhone variant) puts Nafn
        and Netfang side by side on a two-column row (docs/reference/
        hafa-samband.desktop.jpg); the narrow home mini-form stacks every
        field in one column (docs/reference/home.desktop.jpg). showPhone
        already distinguishes those two call sites, so it doubles as the
        layout signal here rather than adding another prop.
      */}
      <div className={showPhone ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
        <div>
          <label htmlFor="contact-nafn" className="sr-only">
            Nafn
          </label>
          <input
            id="contact-nafn"
            name="name"
            type="text"
            placeholder="Nafn"
            autoComplete="name"
            value={nafn}
            onChange={onChange(setNafn)}
            className={fieldClass}
            aria-invalid={errorField === "nafn"}
            aria-describedby={errorField === "nafn" ? "contact-error-message" : undefined}
          />
        </div>
        <div>
          <label htmlFor="contact-netfang" className="sr-only">
            Netfang
          </label>
          <input
            id="contact-netfang"
            name="email"
            type="email"
            placeholder="Netfang"
            autoComplete="email"
            value={netfang}
            onChange={onChange(setNetfang)}
            className={fieldClass}
            aria-invalid={errorField === "netfang"}
            aria-describedby={errorField === "netfang" ? "contact-error-message" : undefined}
          />
        </div>
      </div>
      {showPhone ? (
        <div>
          <label htmlFor="contact-simi" className="sr-only">
            Símanúmer
          </label>
          <input
            id="contact-simi"
            name="phoneNumber"
            type="tel"
            placeholder="Símanúmer"
            autoComplete="tel"
            value={simi}
            onChange={onChange(setSimi)}
            className={fieldClass}
          />
        </div>
      ) : null}
      <div>
        <label htmlFor="contact-skilabod" className="sr-only">
          Skilaboð
        </label>
        <textarea
          id="contact-skilabod"
          name="message"
          placeholder="Skilaboð"
          rows={5}
          value={skilabod}
          onChange={onChange(setSkilabod)}
          className={fieldClass}
          aria-invalid={errorField === "skilabod"}
          aria-describedby={errorField === "skilabod" ? "contact-error-message" : undefined}
        />
      </div>
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">Vefsíða (ekki fylla út)</label>
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
        className="w-full rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sendi..." : submitLabel}
      </button>
    </form>
  );
}
