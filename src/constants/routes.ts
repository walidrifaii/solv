export const ROUTES = {
  home: "/",
  about: "/about",
  shop: "/products",
  services: "/services",
  contact: "/contact",
  order: "/contact",
  account: "/account",
  cart: "/cart",
  discover: "/about",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
