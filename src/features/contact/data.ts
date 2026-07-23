import { footerContact, footerSocial } from "@/data/footer";
import { ROUTES } from "@/constants/routes";

export const contactHero = {
  brand: "SOLV",
} as const;

export const contactFormContent = {
  subjectIds: [
    "general",
    "product",
    "wholesale",
    "delivery",
    "gifting",
    "other",
  ] as const,
} as const;

export type ContactSubject = (typeof contactFormContent.subjectIds)[number];

export const contactInfo = {
  items: [
    {
      id: "phone",
      value: footerContact.phone,
      href: footerContact.phoneHref,
    },
    {
      id: "email",
      value: footerContact.email,
      href: footerContact.emailHref,
    },
    {
      id: "location",
      value: null,
      href: null,
    },
    {
      id: "hours",
      value: null,
      href: null,
    },
  ],
  social: footerSocial,
} as const;

export const contactQuickLinks = [
  { key: "about", href: ROUTES.about },
  { key: "services", href: ROUTES.services },
  { key: "shop", href: ROUTES.shop },
] as const;
