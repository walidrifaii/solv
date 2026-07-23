"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/config";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("locale");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";
  const label =
    nextLocale === "ar" ? t("switchToShort") : t("switchToEnShort");
  const fullLabel = nextLocale === "ar" ? t("switchTo") : t("switchToEn");

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={t("label")}
      title={fullLabel}
      onClick={() => {
        startTransition(async () => {
          await setLocale(nextLocale);
          router.refresh();
        });
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-md border border-white/15 px-2 py-1 text-[11px] font-medium text-[#d1d1d1] transition-colors hover:border-white/30 hover:text-white disabled:opacity-60 sm:px-2.5 sm:text-xs md:text-sm ${className}`}
    >
      {label}
    </button>
  );
}
