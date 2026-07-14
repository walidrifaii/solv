import type { StaticImageData } from "next/image";
import arabica from "@/assets/images/product-arabica-beans.png";
import classicRoast from "@/assets/images/product-classic-roast.png";
import eveningTea from "@/assets/images/product-evening-tea.png";
import greenTea from "@/assets/images/product-green-tea.png";
import houseBlend from "@/assets/images/product-house-blend.png";
import teapot from "@/assets/images/product-teapot.png";
import { productPath } from "@/features/products/data/catalog";

export type FeaturedProduct = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  image: StaticImageData;
  imageAlt: string;
  href: string;
};

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "arabica-beans",
    name: "Premium Arabica Beans",
    subtitle: "100% Arabica",
    price: 69,
    currency: "QAR",
    image: arabica,
    imageAlt: "Premium Arabica coffee beans bag",
    href: productPath("arabica-beans"),
  },
  {
    id: "classic-roast",
    name: "Classic Roast Ground Coffee",
    subtitle: "Medium Roast",
    price: 55,
    currency: "QAR",
    image: classicRoast,
    imageAlt: "Classic roast ground coffee tin",
    href: productPath("classic-roast"),
  },
  {
    id: "green-tea",
    name: "Green Tea Sencha",
    subtitle: "Japanese Sencha",
    price: 49,
    currency: "QAR",
    image: greenTea,
    imageAlt: "Green tea sencha tin",
    href: productPath("green-tea"),
  },
  {
    id: "elegant-teapot",
    name: "Elegant Tea Pot",
    subtitle: "Glass & Stainless Steel",
    price: 120,
    currency: "QAR",
    image: teapot,
    imageAlt: "Glass teapot with metal infuser",
    href: productPath("elegant-teapot"),
  },
  {
    id: "house-blend",
    name: "House Blend Beans",
    subtitle: "Dark Roast",
    price: 62,
    currency: "QAR",
    image: houseBlend,
    imageAlt: "House blend coffee beans",
    href: productPath("house-blend"),
  },
  {
    id: "evening-tea",
    name: "Evening Tea Bags",
    subtitle: "Herbal Blend",
    price: 39,
    currency: "QAR",
    image: eveningTea,
    imageAlt: "Evening herbal tea bags",
    href: productPath("evening-tea"),
  },
];
