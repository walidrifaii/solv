"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";
import { useResetPasswordMutation } from "@/store/slices";
import { getApiErrorMessage } from "@/store/api/errors";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#a5a196] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#C9A962] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function ResetPasswordForm() {
  const t = useTranslations("auth.reset");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const otpToken = searchParams.get("otpToken")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? "";
  const dial = searchParams.get("dial")?.trim() ?? "";
  const national = searchParams.get("national")?.trim() ?? "";
  const phoneMasked = searchParams.get("phoneMasked")?.trim() ?? "";
  const channel = searchParams.get("channel")?.trim() ?? "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    channel === "whatsapp_node"
      ? t("hintWhatsapp", { phone: phoneMasked || national })
      : email
        ? t("hintEmail", { email })
        : "",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!/^\d{6}$/.test(code.trim()) || !password || !confirmPassword) {
      setError(t("validation"));
      return;
    }
    if (password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    try {
      if (otpToken) {
        await resetPassword({
          code: code.trim(),
          newPassword: password,
          otpToken,
          ...(dial && national
            ? { countryCode: `+${dial}`, phone: national }
            : {}),
        }).unwrap();
      } else if (email) {
        await resetPassword({
          email,
          code: code.trim(),
          newPassword: password,
        }).unwrap();
      } else {
        setError(t("missingContext"));
        return;
      }
      router.push(`${ROUTES.login}?reset=1`);
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, t("error")));
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
        {t("eyebrow")}
      </p>
      <h1 className="font-serif text-3xl leading-tight font-medium text-[#a5a196] sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
        {t("description")}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="reset-code" className={labelClass}>
            {t("code")}
          </label>
          <input
            id="reset-code"
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
            className={`${inputClass} tracking-[0.35em] text-center`}
            placeholder="000000"
          />
        </div>

        <div>
          <label htmlFor="reset-password" className={labelClass}>
            {t("newPassword")}
          </label>
          <PasswordInput
            id="reset-password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            className={inputClass}
            placeholder={t("passwordPlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="reset-confirm" className={labelClass}>
            {t("confirmPassword")}
          </label>
          <PasswordInput
            id="reset-confirm"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError("");
            }}
            className={inputClass}
            placeholder={t("confirmPasswordPlaceholder")}
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
-white transition-colors hover:bg-[#D9BC82] disabled:opacity-60 sm:text-base"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#7a6b5d]">
        <Link
          href={ROUTES.forgotPassword}
          className="font-medium text-[#a5a196] underline-offset-2 transition-colors hover:text-[#C9A962] hover:underline"
        >
          {t("requestAgain")}
        </Link>
      </p>
    </div>
  );
}
