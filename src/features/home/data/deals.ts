import type { StaticImageData } from "next/image";
import dealEspresso from "@/assets/images/deal-espresso.png";
import dealGift from "@/assets/images/deal-gift.png";
import dealTea from "@/assets/images/deal-tea.png";
import { ROUTES } from "@/constants/routes";
import { productPath } from "@/features/products/utils";

export type DealProduct = {
  id: string;
  name: string;
  subtitle: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  currency: string;
  image: StaticImageData;
  imageAlt: string;
  href: string;
};

export const hotDeals = {
  eyebrow: "Limited Time Offers",
  title: "Hot Deals",
  description: "Special offers on our most loved products.",
  cta: {
    label: "Shop Deals",
    href: ROUTES.shop,
  },
};

export const dealProducts: DealProduct[] = [
  {
    id: "espresso-blend",
    name: "Espresso Blend Coffee",
    subtitle: "1kg Bag",
    originalPrice: 75,
    salePrice: 60,
    discountPercent: 20,
    currency: "QAR",
    image: dealEspresso,
    imageAlt: "Espresso blend coffee bag",
    href: productPath("espresso-blend"),
  },
  {
    id: "english-breakfast",
    name: "English Breakfast Tea",
    subtitle: "Loose Leaf 500g",
    originalPrice: 55,
    salePrice: 46.75,
    discountPercent: 15,
    currency: "QAR",
    image: dealTea,
    imageAlt: "English breakfast tea tin",
    href: productPath("english-breakfast"),
  },
  {
    id: "coffee-gift-set",
    name: "Coffee Gift Set",
    subtitle: "Perfect for Gifting",
    originalPrice: 120,
    salePrice: 90,
    discountPercent: 25,
    currency: "QAR",
    image: dealGift,
    imageAlt: "Coffee gift set",
    href: productPath("coffee-gift-set"),
  },
];
