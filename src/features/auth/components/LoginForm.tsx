"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import {
  CountryCodeSelect,
  useDefaultCountry,
} from "@/features/auth/components/CountryCodeSelect";
import { authCopy } from "@/features/auth/data";
import { ROUTES } from "@/constants/routes";
import { useLoginMutation } from "@/store/slices";
import {
  getApiErrorDetails,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/store/api/errors";
import type { ApiCountry } from "@/store/api/types";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#a5a196] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#C9A962] sm:text-base";

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
  const tPhone = useTranslations("auth.phone");
  const copy = authCopy.login;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();
  const defaultCountry = useDefaultCountry();

  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [country, setCountry] = useState<ApiCountry | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!country && defaultCountry) setCountry(defaultCountry);
  }, [country, defaultCountry]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!password) {
      setError(t("validation"));
      return;
    }

    if (mode === "phone" && (!phone.trim() || !country)) {
      setError(t("validation"));
      return;
    }
    if (mode === "email" && !email.trim()) {
      setError(t("validation"));
      return;
    }

    try {
      if (mode === "phone" && country) {
        await login({
          countryCode: `+${country.dialCode}`,
          phone: phone.trim(),
          password,
        }).unwrap();
      } else {
        await login({ email: email.trim(), password }).unwrap();
      }
      router.push(safeNextPath(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      const details = getApiErrorDetails(err);
      if (getApiErrorStatus(err) === 403 && details?.code === "PHONE_NOT_VERIFIED") {
        const params = new URLSearchParams();
        if (typeof details.phone === "string") params.set("phone", details.phone);
        if (country) {
          params.set("countryId", country.id);
          params.set("dial", country.dialCode);
          params.set("national", phone.trim());
        }
        router.push(`${ROUTES.verify}?${params.toString()}`);
        return;
      }
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
      <h1 className="font-serif text-3xl leading-tight font-medium text-[#a5a196] sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
        {t("description")}
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("phone");
            setError("");
          }}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
            mode === "phone"
              ? "bg-[#a5a196] text-white"
              : "bg-[#F6EDE6] text-[#7a6b5d] hover:text-[#a5a196]"
          }`}
        >
          {tPhone("phone")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("email");
            setError("");
          }}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
            mode === "email"
              ? "bg-[#a5a196] text-white"
              : "bg-[#F6EDE6] text-[#7a6b5d] hover:text-[#a5a196]"
          }`}
        >
          {t("email")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {mode === "phone" ? (
          <div>
            <label htmlFor="login-phone" className={labelClass}>
              {tPhone("phone")}
            </label>
            <div className="flex items-stretch gap-2">
              <CountryCodeSelect
                id="login-country"
                value={country?.id ?? "qa"}
                onChange={setCountry}
              />
              <input
                id="login-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/[^\d]/g, "").slice(0, 15));
                  setError("");
                }}
                className={`${inputClass} min-w-0 flex-1`}
                placeholder={tPhone("phonePlaceholder")}
              />
            </div>
          </div>
        ) : (
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
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="login-password" className={labelClass + " mb-0"}>
              {t("password")}
            </label>
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs text-[#8a7a6c] transition-colors hover:text-[#a5a196]"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <PasswordInput
            id="login-password"
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
-white transition-colors hover:bg-[#D9BC82] disabled:opacity-60 sm:text-base"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#7a6b5d]">
        {t("switchPrompt")}{" "}
        <Link
          href={copy.switchHref}
          className="font-medium text-[#a5a196] underline-offset-2 transition-colors hover:text-[#C9A962] hover:underline"
        >
          {t("switchLabel")}
        </Link>
      </p>
    </div>
  );
}
