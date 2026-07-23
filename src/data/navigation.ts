import { ROUTES } from "@/constants/routes";

export const navigation = [
  { key: "home", href: ROUTES.home },
  { key: "about", href: ROUTES.about },
  {
    key: "shop",
    href: ROUTES.shop,
    children: [
      { key: "coffee", href: `${ROUTES.shop}?category=coffee` },
      { key: "tea", href: `${ROUTES.shop}?category=tea` },
      { key: "accessories", href: `${ROUTES.shop}?category=accessories` },
    ],
  },
  { key: "services", href: ROUTES.services },
  { key: "contact", href: ROUTES.contact },
] as const;
