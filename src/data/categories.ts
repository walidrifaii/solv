import { ROUTES } from "@/constants/routes";

export type CategoryCard = {
  id: string;
  name: string;
  href: string;
  image: string;
  imageAlt: string;
};

/** Fallback cards if API is unavailable */
export const shopCategories: CategoryCard[] = [
  {
    id: "coffee-beans",
    name: "Coffee Beans",
    href: `${ROUTES.shop}?category=coffee-beans`,
    image: "/assets/category-coffee-beans.png",
    imageAlt: "Coffee Beans",
  },
  {
    id: "ground-coffee",
    name: "Ground Coffee",
    href: `${ROUTES.shop}?category=ground-coffee`,
    image: "/assets/category-ground-coffee.png",
    imageAlt: "Ground Coffee",
  },
  {
    id: "tea",
    name: "Tea",
    href: `${ROUTES.shop}?category=tea`,
    image: "/assets/category-tea.png",
    imageAlt: "Tea",
  },
  {
    id: "tea-bags",
    name: "Tea Bags",
    href: `${ROUTES.shop}?category=tea-bags`,
    image: "/assets/category-tea-bags.png",
    imageAlt: "Tea Bags",
  },
  {
    id: "accessories",
    name: "Accessories",
    href: `${ROUTES.shop}?category=accessories`,
    image: "/assets/category-accessories.png",
    imageAlt: "Accessories",
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    href: `${ROUTES.shop}?category=gift-sets`,
    image: "/assets/category-gift-sets.png",
    imageAlt: "Gift Sets",
  },
];
