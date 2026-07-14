import { ROUTES } from "@/constants/routes";

export const navigation = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  {
    label: "Shop",
    href: ROUTES.shop,
    children: [
      { label: "Coffee", href: `${ROUTES.shop}?category=coffee` },
      { label: "Tea", href: `${ROUTES.shop}?category=tea` },
      { label: "Accessories", href: `${ROUTES.shop}?category=accessories` },
    ],
  },
  { label: "Services", href: ROUTES.services },
  { label: "Contact Us", href: ROUTES.contact },
] as const;
