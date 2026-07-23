import type { Locale } from "@/i18n/config";

/** Prefer Arabic field when locale is ar and the value is non-empty; otherwise English. */
export function pickLocalized(
  locale: Locale,
  en: string,
  ar: string | null | undefined,
): string {
  if (locale === "ar" && ar?.trim()) return ar;
  return en;
}

export function pickLocalizedOptional(
  locale: Locale,
  en: string | null | undefined,
  ar: string | null | undefined,
): string | null {
  if (locale === "ar" && ar?.trim()) return ar;
  if (en?.trim()) return en;
  return null;
}
