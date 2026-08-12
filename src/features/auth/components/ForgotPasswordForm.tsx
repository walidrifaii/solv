"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  CountryCodeSelect,
  useDefaultCountry,
} from "@/features/auth/components/CountryCodeSelect";
import { ROUTES } from "@/constants/routes";
import { useForgotPasswordMutation } from "@/store/slices";
import { getApiErrorMessage } from "@/store/api/errors";
import type { ApiCountry } from "@/store/api/types";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#a5a196] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#C9A962] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgot");
  const tPhone = useTranslations("auth.phone");
  const tLogin = useTranslations("auth.login");
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const defaultCountry = useDefaultCountry();

  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [country, setCountry] = useState<ApiCountry | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!country && defaultCountry) setCountry(defaultCountry);
  }, [country, defaultCountry]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      if (mode === "phone") {
        if (!phone.trim() || !country) {
          setError(t("validation"));
          return;
        }
        const result = await forgotPassword({
          countryCode: `+${country.dialCode}`,
          phone: phone.trim(),
        }).unwrap();

        const params = new URLSearchParams({
          channel: result.channel,
        });
        if (result.otpToken) params.set("otpToken", result.otpToken);
        params.set("countryId", country.id);
        params.set("dial", country.dialCode);
        params.set("national", phone.trim());
        if (result.phoneMasked) params.set("phoneMasked", result.phoneMasked);
        router.push(`${ROUTES.resetPassword}?${params.toString()}`);
      } else {
        if (!email.trim()) {
          setError(t("validation"));
          return;
        }
        const result = await forgotPassword({ email: email.trim() }).unwrap();
        const params = new URLSearchParams({
          channel: result.channel,
        });
        if (result.otpToken) {
          params.set("otpToken", result.otpToken);
          if (result.phoneMasked) params.set("phoneMasked", result.phoneMasked);
        } else {
          params.set("email", email.trim());
        }
        router.push(`${ROUTES.resetPassword}?${params.toString()}`);
      }
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
          {tLogin("email")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {mode === "phone" ? (
          <div>
            <label htmlFor="forgot-phone" className={labelClass}>
              {tPhone("phone")}
            </label>
            <div className="flex gap-2">
              <CountryCodeSelect
                id="forgot-country"
                value={country?.id ?? "qa"}
                onChange={setCountry}
              />
              <input
                id="forgot-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/[^\d]/g, "").slice(0, 15));
                  setError("");
                }}
                className={inputClass}
                placeholder={tPhone("phonePlaceholder")}
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="forgot-email" className={labelClass}>
              {tLogin("email")}
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              className={inputClass}
              placeholder={tLogin("emailPlaceholder")}
            />
          </div>
        )}

        {error ? (
          <p className="text-sm text-[#a35d5d]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#C9A962] px-6 py-3 text-sm font-medium text-[#a5a196] transition-colors hover:bg-[#D9BC82] disabled:opacity-60 sm:text-base"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#7a6b5d]">
        <Link
          href={ROUTES.login}
          className="font-medium text-[#a5a196] underline-offset-2 transition-colors hover:text-[#C9A962] hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  );
}
