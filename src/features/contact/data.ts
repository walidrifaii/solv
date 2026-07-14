import { footerContact, footerSocial } from "@/data/footer";
import { ROUTES } from "@/constants/routes";

export const contactHero = {
  eyebrow: "Contact Us",
  brand: "SOLV",
  title: "Let's talk coffee, tea, and supply",
  description:
    "Questions, wholesale requests, or gift orders — reach the SOLV team in Qatar and we'll help you find the right next step.",
} as const;

export const contactFormContent = {
  eyebrow: "Send a Message",
  title: "We're here to help",
  description:
    "Share a few details and our team will get back to you during business hours.",
  subjects: [
    "General inquiry",
    "Product question",
    "Wholesale / hospitality",
    "Delivery & orders",
    "Corporate gifting",
    "Other",
  ] as const,
  fields: {
    name: "Full name",
    email: "Email address",
    phone: "Phone number",
    subject: "Subject",
    message: "Your message",
  },
  cta: "Send Message",
  success: "Thank you — your message has been received. We'll be in touch soon.",
} as const;

export const contactInfo = {
  eyebrow: "Reach Us Directly",
  title: "Contact details",
  description:
    "Prefer to call, message, or visit? Use the channels below — we respond Mon to Sat.",
  items: [
    {
      id: "phone",
      label: "Phone",
      value: footerContact.phone,
      href: footerContact.phoneHref,
    },
    {
      id: "email",
      label: "Email",
      value: footerContact.email,
      href: footerContact.emailHref,
    },
    {
      id: "location",
      label: "Location",
      value: footerContact.location,
      href: null,
    },
    {
      id: "hours",
      label: "Hours",
      value: footerContact.hours,
      href: null,
    },
  ],
  social: footerSocial,
} as const;

export const contactQuickLinks = [
  { label: "About Solv", href: ROUTES.about },
  { label: "Our Services", href: ROUTES.services },
  { label: "Shop Collection", href: ROUTES.shop },
] as const;
