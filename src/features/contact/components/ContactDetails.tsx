import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";
import { contactInfo, contactQuickLinks } from "@/features/contact/data";

const iconMap = {
  phone: PhoneIcon,
  email: MailIcon,
  location: MapPinIcon,
  hours: ClockIcon,
} as const;

const socialIconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
} as const;

export async function ContactDetails() {
  const t = await getTranslations("contact.info");
  const tFooter = await getTranslations("footer");
  const tContact = await getTranslations("contact.quickLinks");

  const itemValues: Record<string, string> = {
    location: tFooter("location"),
    hours: tFooter("hours"),
  };

  return (
    <aside className="flex h-full flex-col bg-[#F6EDE6] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
        {t("eyebrow")}
      </p>
      <h2 className="font-serif text-2xl leading-tight font-medium text-[#2a1f16] sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:text-[15px]">
        {t("description")}
      </p>

      <ul className="mt-8 space-y-6 border-t border-[#e0d2c4] pt-8">
        {contactInfo.items.map((item) => {
          const Icon = iconMap[item.id as keyof typeof iconMap];
          const value = item.value ?? itemValues[item.id];
          const content = (
            <>
              <Icon className="mt-0.5 size-4 shrink-0 text-[#c4a574]" />
              <span>
                <span className="block text-[10px] font-medium tracking-[0.16em] text-[#b0895b] uppercase">
                  {t(item.id)}
                </span>
                <span className="mt-1 block text-sm text-[#2a1f16] sm:text-base">
                  {value}
                </span>
              </span>
            </>
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <a
                  href={item.href}
                  className="flex items-start gap-3 transition-opacity hover:opacity-75"
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-start gap-3">{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 border-t border-[#e0d2c4] pt-8">
        <p className="text-[10px] font-medium tracking-[0.16em] text-[#b0895b] uppercase">
          {t("follow")}
        </p>
        <div className="mt-4 flex items-center gap-4 text-[#2a1f16]">
          {contactInfo.social.map((item) => {
            const Icon = socialIconMap[item.key];
            return (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                aria-label={tFooter(item.key)}
              >
                <Icon className="size-5" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-auto border-t border-[#e0d2c4] pt-8 sm:mt-10">
        <p className="text-[10px] font-medium tracking-[0.16em] text-[#b0895b] uppercase">
          {tContact("heading")}
        </p>
        <ul className="mt-3 space-y-2">
          {contactQuickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[#2a1f16] transition-colors hover:text-[#c4a574]"
              >
                {tContact(link.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
