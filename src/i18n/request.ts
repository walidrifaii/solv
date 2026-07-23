import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export default getRequestConfig(async () => {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "";

  // Admin dashboard stays English regardless of storefront locale cookie
  if (isDashboardPath(pathname)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../../messages/${defaultLocale}.json`)).default,
    };
  }

  const store = await cookies();
  const cookieLocale = store.get(localeCookieName)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
