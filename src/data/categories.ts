import { ROUTES } from "@/constants/routes";

export type CategoryCard = {
  id: string;
  name: string;
  href: string;
  /** Public path from API (`imagePath`), e.g. `/assets/category-tea.png` */
  imagePath: string;
  imageAlt: string;
};

/** Fallback if API is unavailable */
export const shopCategories: CategoryCard[] = [
  {
    id: "coffee-beans",
    name: "Coffee Beans",
    href: `${ROUTES.shop}?category=coffee-beans`,
    imagePath: "/assets/category-coffee-beans.png",
    imageAlt: "Coffee Beans",
  },
  {
    id: "ground-coffee",
    name: "Ground Coffee",
    href: `${ROUTES.shop}?category=ground-coffee`,
    imagePath: "/assets/category-ground-coffee.png",
    imageAlt: "Ground Coffee",
  },
  {
    id: "tea",
    name: "Tea",
    href: `${ROUTES.shop}?category=tea`,
    imagePath: "/assets/category-tea.png",
    imageAlt: "Tea",
  },
  {
    id: "tea-bags",
    name: "Tea Bags",
    href: `${ROUTES.shop}?category=tea-bags`,
    imagePath: "/assets/category-tea-bags.png",
    imageAlt: "Tea Bags",
  },
  {
    id: "accessories",
    name: "Accessories",
    href: `${ROUTES.shop}?category=accessories`,
    imagePath: "/assets/category-accessories.png",
    imageAlt: "Accessories",
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    href: `${ROUTES.shop}?category=gift-sets`,
    imagePath: "/assets/category-gift-sets.png",
    imageAlt: "Gift Sets",
  },
];
