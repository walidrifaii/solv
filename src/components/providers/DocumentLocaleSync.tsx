"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getDirection, type Locale } from "@/i18n/config";

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

/** Keeps admin routes locked to English LTR even if the storefront locale is Arabic. */
export function DocumentLocaleSync({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  useEffect(() => {
    const root = document.documentElement;
    const onDashboard = isDashboardPath(pathname);
    const activeLocale: Locale = onDashboard ? "en" : locale;
    const dir = onDashboard ? "ltr" : getDirection(activeLocale);

    root.lang = activeLocale;
    root.dir = dir;
    root.classList.toggle("font-ar", !onDashboard && activeLocale === "ar");
  }, [pathname, locale]);

  return <>{children}</>;
}
