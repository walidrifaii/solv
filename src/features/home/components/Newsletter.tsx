"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import newsletterImage from "@/assets/images/newsletter-community.png";
import { newsletterContent } from "@/features/home/data/newsletter";
import { getApiErrorMessage } from "@/store/api/errors";
import { useSubscribeMutation } from "@/store/slices";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [subscribe, { isLoading }] = useSubscribeMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitted(false);

    try {
      await subscribe({ email: email.trim() }).unwrap();
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not subscribe. Try again."));
    }
  }

  return (
    <section className="bg-[#FEF9F6] text-[#2a1f16]">
      <div className="mx-auto grid w-full max-w-[1400px] items-stretch md:grid-cols-2">
        <div className="relative min-h-[14rem] overflow-hidden sm:min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem]">
          <Image
            src={newsletterImage}
            alt="SOLV community coffee and tea setup"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-[#FEF9F6] md:block" />
        </div>

        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-12 lg:px-14 lg:py-14">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {newsletterContent.eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.5rem]">
            {newsletterContent.title}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
            {newsletterContent.description}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-lg flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-0"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
                setError("");
              }}
              placeholder={newsletterContent.placeholder}
              className="w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] focus:border-[#c4a574] sm:rounded-r-none sm:text-base"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0 rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#d4b584] disabled:opacity-60 sm:rounded-l-none sm:px-7 sm:text-base"
            >
              {isLoading ? "…" : newsletterContent.cta}
            </button>
          </form>

          {error ? (
            <p className="mt-3 text-sm text-[#a35d5d]" role="alert">
              {error}
            </p>
          ) : null}

          {submitted ? (
            <p className="mt-3 text-sm text-[#6f8f5a]" role="status">
              Thanks for subscribing.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
