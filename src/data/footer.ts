import { ROUTES } from "@/constants/routes";

export const footerShopLinks = [
  { label: "All Products", href: ROUTES.shop },
  { label: "Coffee Beans", href: `${ROUTES.shop}?category=coffee-beans` },
  { label: "Ground Coffee", href: `${ROUTES.shop}?category=ground-coffee` },
  { label: "Tea", href: `${ROUTES.shop}?category=tea` },
  { label: "Tea Bags", href: `${ROUTES.shop}?category=tea-bags` },
  { label: "Accessories", href: `${ROUTES.shop}?category=accessories` },
  { label: "Gift Sets", href: `${ROUTES.shop}?category=gift-sets` },
] as const;

export const footerCompanyLinks = [
  { label: "About Us", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQs", href: "/faqs" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

export const footerContact = {
  phone: "+974 3000 1234",
  phoneHref: "tel:+97430001234",
  email: "info@solvcoffee.qa",
  emailHref: "mailto:info@solvcoffee.qa",
  location: "Doha, Qatar",
  hours: "Mon - Sat: 8:00 AM - 8:00 PM",
} as const;

export const footerSocial = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "WhatsApp", href: "https://wa.me/97430001234" },
] as const;

export const footerBrand = {
  description:
    "Premium coffee & tea supplier in Qatar, dedicated to bringing you the finest quality and exceptional service.",
} as const;
