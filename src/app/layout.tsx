import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AppProviders } from "@/components/providers/AppProviders";
import { config } from "@/constants/config";
import { getDirection, type Locale } from "@/i18n/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: config.appName,
    description: t("description"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const forceEnglish = isDashboardPath(pathname);

  const locale = forceEnglish ? ("en" as Locale) : ((await getLocale()) as Locale);
  const messages = forceEnglish
    ? (await import("../../messages/en.json")).default
    : await getMessages();
  const dir = forceEnglish ? "ltr" : getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cairo.variable} h-full antialiased ${!forceEnglish && locale === "ar" ? "font-ar" : ""}`}
    >
      <body className="flex min-h-full flex-col bg-[#17100a] text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <SiteChrome>{children}</SiteChrome>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
