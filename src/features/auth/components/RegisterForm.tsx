"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authCopy } from "@/features/auth/data";
import { ROUTES } from "@/constants/routes";
import { useRegisterMutation } from "@/store/slices";
import { getApiErrorMessage } from "@/store/api/errors";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("common");
  const copy = authCopy.register;
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
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
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      const verifyEmail = result.email || email.trim();
      router.push(
        `${ROUTES.verify}?email=${encodeURIComponent(verifyEmail)}`,
      );
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
      <h1 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
        {t("description")}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="register-name" className={labelClass}>
            {t("name")}
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            className={inputClass}
            placeholder={t("namePlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="register-email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className={inputClass}
            placeholder={t("emailPlaceholder")}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="register-password" className={labelClass + " mb-0"}>
              {t("password")}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="text-xs text-[#8a7a6c] transition-colors hover:text-[#2a1f16]"
            >
              {showPassword ? tCommon("hide") : tCommon("show")}
            </button>
          </div>
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
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
          <label htmlFor="register-confirm" className={labelClass}>
            {t("confirmPassword")}
          </label>
          <input
            id="register-confirm"
            type={showPassword ? "text" : "password"}
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

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:opacity-60 sm:text-base"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#7a6b5d]">
        {t("switchPrompt")}{" "}
        <Link
          href={copy.switchHref}
          className="font-medium text-[#2a1f16] underline-offset-2 transition-colors hover:text-[#c4a574] hover:underline"
        >
          {t("switchLabel")}
        </Link>
      </p>
    </div>
  );
}
