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
  dashboard: "/dashboard",
  dashboardLogin: "/dashboard/login",
  dashboardOrders: "/dashboard/orders",
  dashboardProducts: "/dashboard/products",
  dashboardCategories: "/dashboard/categories",
  dashboardSubscribers: "/dashboard/subscribers",
  dashboardSettings: "/dashboard/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
