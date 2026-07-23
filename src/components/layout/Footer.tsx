"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { SolvLogoWhite } from "@/components/icons/SolvLogoWhite";
import {
  ApplePayLogo,
  MastercardLogo,
  VisaLogo,
} from "@/components/icons/PaymentLogos";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";
import { ROUTES } from "@/constants/routes";
import {
  footerCompanyLinks,
  footerContact,
  footerShopLinks,
  footerSocial,
} from "@/data/footer";

const linkClass =
  "text-sm leading-7 text-white/70 transition-colors hover:text-white";

const headingClass =
  "mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
} as const;

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-auto overflow-hidden bg-[#140e0a] text-white"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.035) 0.7px, transparent 0.7px)",
        backgroundSize: "3px 3px",
      }}
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-x-4 gap-y-8 px-4 py-12 sm:gap-x-6 sm:gap-y-10 sm:px-6 sm:py-14 md:gap-x-8 md:gap-y-12 md:px-8 lg:grid-cols-5 lg:gap-x-8 lg:px-10 lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <Link href={ROUTES.home} className="inline-block leading-none">
            <SolvLogoWhite className="block h-9 w-auto sm:h-10" />
          </Link>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/65">
            {t("brandDescription")}
          </p>
          <div className="mt-4 flex items-center gap-4 text-white">
            {footerSocial.map((item) => {
              const Icon = socialIcons[item.key];
              return (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                  aria-label={t(item.key)}
                >
                  <Icon className="size-[1.125rem]" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className={headingClass}>{t("shop")}</h3>
          <ul className="space-y-2">
            {footerShopLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className={headingClass}>{t("company")}</h3>
          <ul className="space-y-2">
            {footerCompanyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className={headingClass}>{t("customerService")}</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a
                href={footerContact.phoneHref}
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <PhoneIcon className="size-4 shrink-0 text-white" />
                <span className="break-all" dir="ltr">
                  {footerContact.phone}
                </span>
              </a>
            </li>
            <li>
              <a
                href={footerContact.emailHref}
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <MailIcon className="size-4 shrink-0 text-white" />
                <span className="break-all" dir="ltr">
                  {footerContact.email}
                </span>
              </a>
            </li>
            <li className="inline-flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-white" />
              <span>{t("location")}</span>
            </li>
            <li className="inline-flex items-start gap-2.5">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-white" />
              <span>{t("hours")}</span>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className={headingClass}>{t("paymentMethods")}</h3>
          <div className="flex flex-row flex-wrap items-center gap-3 text-white sm:gap-4">
            <VisaLogo className="h-5 w-14 shrink-0" />
            <MastercardLogo className="h-6 w-10 shrink-0" />
            <ApplePayLogo className="h-6 w-16 shrink-0" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-white/45 sm:flex-row sm:px-6 sm:text-start md:px-8 lg:px-10 sm:text-sm">
          <p>{t("copyright", { year })}</p>
          <p>
            {tCommon("poweredBy")}{" "}
            <a
              href="https://www.amctag.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              amctag
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
