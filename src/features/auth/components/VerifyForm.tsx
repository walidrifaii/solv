"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authCopy } from "@/features/auth/data";
import { ROUTES } from "@/constants/routes";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/store/slices";
import { getApiErrorMessage } from "@/store/api/errors";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base tracking-[0.35em] text-center";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function VerifyForm() {
  const copy = authCopy.verify;
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email")?.trim() ?? "";

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();
  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    emailFromQuery ? `Code sent to ${emailFromQuery}` : "",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !/^\d{6}$/.test(code.trim())) {
      setError("Enter your email and the 6-digit code.");
      return;
    }

    try {
      await verifyOtp({ email: email.trim(), code: code.trim() }).unwrap();
      router.push(ROUTES.account);
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not verify code."));
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    try {
      const result = await resendOtp({ email: email.trim() }).unwrap();
      setInfo(result.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not resend code."));
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
        {copy.eyebrow}
      </p>
      <h1 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
        {copy.description}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="verify-email" className={labelClass}>
            Email
          </label>
          <input
            id="verify-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className="w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base tracking-normal text-left"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label htmlFor="verify-code" className={labelClass}>
            Verification code
          </label>
          <input
            id="verify-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            className={inputClass}
            placeholder="000000"
          />
        </div>

        {error ? (
          <p className="text-sm text-[#a35d5d]" role="alert">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="text-sm text-[#4f6b45]" role="status">
            {info}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:opacity-60 sm:text-base"
        >
          {isLoading ? "Verifying…" : copy.submit}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="mt-4 text-sm text-[#8a7a6c] transition-colors hover:text-[#2a1f16] disabled:opacity-60"
      >
        {resending ? "Sending…" : "Resend code"}
      </button>

      <p className="mt-8 text-sm text-[#7a6b5d]">
        Wrong email?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-[#2a1f16] underline-offset-2 transition-colors hover:text-[#c4a574] hover:underline"
        >
          Register again
        </Link>
      </p>
    </div>
  );
}
