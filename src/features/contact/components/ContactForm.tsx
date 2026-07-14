"use client";

import { useState, type FormEvent } from "react";
import { contactFormContent } from "@/features/contact/data";

type Subject = (typeof contactFormContent.subjects)[number];

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<Subject>(contactFormContent.subjects[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setPhone("");
    setSubject(contactFormContent.subjects[0]);
    setMessage("");
  }

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
        {contactFormContent.eyebrow}
      </p>
      <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl">
        {contactFormContent.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
        {contactFormContent.description}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:mt-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {contactFormContent.fields.name}
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSubmitted(false);
              }}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              {contactFormContent.fields.email}
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
              }}
              className={inputClass}
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              {contactFormContent.fields.phone}
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setSubmitted(false);
              }}
              className={inputClass}
              placeholder="+974 …"
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              {contactFormContent.fields.subject}
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value as Subject);
                setSubmitted(false);
              }}
              className={`${inputClass} appearance-none`}
            >
              {contactFormContent.subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            {contactFormContent.fields.message}
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSubmitted(false);
            }}
            className={`${inputClass} min-h-[8rem] resize-y`}
            placeholder="How can we help?"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] sm:w-auto sm:px-8 sm:text-base"
        >
          {contactFormContent.cta}
        </button>

        {submitted ? (
          <p className="text-sm text-[#6f8f5a]" role="status">
            {contactFormContent.success}
          </p>
        ) : null}
      </form>
    </div>
  );
}
