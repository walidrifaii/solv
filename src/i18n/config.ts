export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

/** Admin dashboard is always English regardless of storefront default. */
export const dashboardLocale: Locale = "en";

export const localeCookieName = "SOLV_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "ar";
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
