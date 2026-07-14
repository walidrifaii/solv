export const ROUTES = {
  home: "/",
  about: "/about",
  shop: "/products",
  services: "/services",
  contact: "/contact",
  order: "/checkout",
  account: "/account",
  login: "/login",
  register: "/register",
  cart: "/cart",
  checkout: "/checkout",
  discover: "/about",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
