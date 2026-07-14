import type { StaticImageData } from "next/image";
import accessories from "@/assets/images/category-accessories.png";
import coffeeBeans from "@/assets/images/category-coffee-beans.png";
import giftSets from "@/assets/images/category-gift-sets.png";
import groundCoffee from "@/assets/images/category-ground-coffee.png";
import tea from "@/assets/images/category-tea.png";
import teaBags from "@/assets/images/category-tea-bags.png";
import { ROUTES } from "@/constants/routes";

export type CategoryCard = {
  id: string;
  name: string;
  href: string;
  image: StaticImageData;
  imageAlt: string;
};

export const shopCategories: CategoryCard[] = [
  {
    id: "coffee-beans",
    name: "Coffee Beans",
    href: `${ROUTES.shop}?category=coffee-beans`,
    image: coffeeBeans,
    imageAlt: "Roasted coffee beans in a wooden bowl",
  },
  {
    id: "ground-coffee",
    name: "Ground Coffee",
    href: `${ROUTES.shop}?category=ground-coffee`,
    image: groundCoffee,
    imageAlt: "Fresh ground coffee on a wooden scoop",
  },
  {
    id: "tea",
    name: "Tea",
    href: `${ROUTES.shop}?category=tea`,
    image: tea,
    imageAlt: "Loose leaf tea with dried botanicals",
  },
  {
    id: "tea-bags",
    name: "Tea Bags",
    href: `${ROUTES.shop}?category=tea-bags`,
    image: teaBags,
    imageAlt: "Premium tea bags with loose leaves",
  },
  {
    id: "accessories",
    name: "Accessories",
    href: `${ROUTES.shop}?category=accessories`,
    image: accessories,
    imageAlt: "Coffee grinder and brewing accessories",
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    href: `${ROUTES.shop}?category=gift-sets`,
    image: giftSets,
    imageAlt: "Gift box with coffee and tea set",
  },
];
