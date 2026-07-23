import { ROUTES } from "@/constants/routes";

export const footerShopLinks = [
  { key: "allProducts", href: ROUTES.shop },
  { key: "coffeeBeans", href: `${ROUTES.shop}?category=coffee-beans` },
  { key: "groundCoffee", href: `${ROUTES.shop}?category=ground-coffee` },
  { key: "tea", href: `${ROUTES.shop}?category=tea` },
  { key: "teaBags", href: `${ROUTES.shop}?category=tea-bags` },
  { key: "accessories", href: `${ROUTES.shop}?category=accessories` },
  { key: "giftSets", href: `${ROUTES.shop}?category=gift-sets` },
] as const;

export const footerCompanyLinks = [
  { key: "aboutUs", href: ROUTES.about },
  { key: "services", href: ROUTES.services },
  { key: "trackOrder", href: "/track-order" },
  { key: "faqs", href: "/faqs" },
  { key: "returns", href: "/returns" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
] as const;

export const footerContact = {
  phone: "+974 3000 1234",
  phoneHref: "tel:+97430001234",
  email: "info@solvcoffee.qa",
  emailHref: "mailto:info@solvcoffee.qa",
} as const;

export const footerSocial = [
  { key: "facebook" as const, href: "https://facebook.com" },
  { key: "instagram" as const, href: "https://instagram.com" },
  { key: "whatsapp" as const, href: "https://wa.me/97430001234" },
];
