"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authCopy } from "@/features/auth/data";
import { ROUTES } from "@/constants/routes";
import { useLoginMutation } from "@/store/slices";
import {
  getApiErrorDetails,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/store/api/errors";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

function safeNextPath(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return ROUTES.account;
  }
  return raw;
}

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const copy = authCopy.login;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError(t("validation"));
      return;
    }

    try {
      await login({ email: email.trim(), password }).unwrap();
      router.push(safeNextPath(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      const details = getApiErrorDetails(err);
      if (
        getApiErrorStatus(err) === 403 &&
        details?.code === "EMAIL_NOT_VERIFIED"
      ) {
        const verifyEmail =
          typeof details.email === "string" ? details.email : email.trim();
        router.push(
          `${ROUTES.verify}?email=${encodeURIComponent(verifyEmail)}`,
        );
        return;
      }
      setError(getApiErrorMessage(err, t("invalidCredentials")));
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
          <label htmlFor="login-email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="login-email"
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
            <label htmlFor="login-password" className={labelClass + " mb-0"}>
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
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
