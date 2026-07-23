"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { contactFormContent, type ContactSubject } from "@/features/contact/data";
import { getApiErrorMessage } from "@/store/api/errors";
import { useSendContactMessageMutation } from "@/store/slices";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [sendMessage, { isLoading }] = useSendContactMessageMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<ContactSubject>(
    contactFormContent.subjectIds[0],
  );
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setError("");
    setSubmitted(false);

    try {
      await sendMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: t(`subjects.${subject}`),
        message: message.trim(),
      }).unwrap();
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject(contactFormContent.subjectIds[0]);
      setMessage("");
    } catch (err) {
      setError(getApiErrorMessage(err, t("error")));
    }
  }

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
        {t("eyebrow")}
      </p>
      <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
        {t("description")}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:mt-10" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {t("name")}
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSubmitted(false);
                setError("");
              }}
              className={inputClass}
              placeholder={t("name")}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              {t("email")}
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
                setError("");
              }}
              className={inputClass}
              placeholder={t("email")}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              {t("phone")}
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setSubmitted(false);
                setError("");
              }}
              className={inputClass}
              placeholder={t("phone")}
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              {t("subject")}
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value as ContactSubject);
                setSubmitted(false);
                setError("");
              }}
              className={`${inputClass} appearance-none`}
            >
              {contactFormContent.subjectIds.map((id) => (
                <option key={id} value={id}>
                  {t(`subjects.${id}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            {t("message")}
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            minLength={10}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSubmitted(false);
              setError("");
            }}
            className={`${inputClass} min-h-[8rem] resize-y`}
            placeholder={t("message")}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:opacity-60 sm:w-auto sm:px-8 sm:text-base"
        >
          {isLoading ? t("sending") : t("cta")}
        </button>

        {error ? (
          <p className="text-sm text-[#a35d5d]" role="alert">
            {error}
          </p>
        ) : null}

        {submitted ? (
          <p className="text-sm text-[#6f8f5a]" role="status">
            {t("success")}
          </p>
        ) : null}
      </form>
    </div>
  );
}
