import Link from "next/link";
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
  footerBrand,
  footerCompanyLinks,
  footerContact,
  footerShopLinks,
} from "@/data/footer";

const linkClass =
  "text-sm leading-7 text-white/70 transition-colors hover:text-white";

const headingClass =
  "mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase";

export function Footer() {
  return (
    <footer
      className="relative mt-auto overflow-hidden bg-[#140e0a] text-white"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.035) 0.7px, transparent 0.7px)",
        backgroundSize: "3px 3px",
      }}
    >
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:px-8 lg:grid-cols-5 lg:gap-x-8 lg:px-10 lg:py-16">
        <div>
          <Link href={ROUTES.home} className="inline-block leading-none">
            <SolvLogoWhite className="block h-9 w-auto sm:h-10" />
          </Link>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/65">
            {footerBrand.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-white">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              aria-label="Facebook"
            >
              <FacebookIcon className="size-[1.125rem]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              aria-label="Instagram"
            >
              <InstagramIcon className="size-[1.125rem]" />
            </a>
            <a
              href="https://wa.me/97430001234"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="size-[1.125rem]" />
            </a>
          </div>
        </div>

        <div>
          <h3 className={headingClass}>Shop</h3>
          <ul className="space-y-2">
            {footerShopLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Company</h3>
          <ul className="space-y-2">
            {footerCompanyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Customer Service</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a
                href={footerContact.phoneHref}
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <PhoneIcon className="size-4 shrink-0 text-white" />
                {footerContact.phone}
              </a>
            </li>
            <li>
              <a
                href={footerContact.emailHref}
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <MailIcon className="size-4 shrink-0 text-white" />
                {footerContact.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-white" />
              {footerContact.location}
            </li>
            <li className="inline-flex items-start gap-2.5">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-white" />
              {footerContact.hours}
            </li>
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Payment Methods</h3>
          <div className="flex flex-row flex-wrap items-center gap-3 text-white sm:gap-4">
            <VisaLogo className="h-5 w-14 shrink-0" />
            <MastercardLogo className="h-6 w-10 shrink-0" />
            <ApplePayLogo className="h-6 w-16 shrink-0" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-white/45 sm:flex-row sm:px-6 sm:text-left md:px-8 lg:px-10 sm:text-sm">
          <p>© 2024 SOLV Coffee & Tea Supplier. All Rights Reserved.</p>
          <p>
            powered by{" "}
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
