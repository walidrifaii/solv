import hero1 from "@/assets/images/hero.png";
import hero2 from "@/assets/images/hero-2.png";
import hero3 from "@/assets/images/hero-3.png";
import { ROUTES } from "@/constants/routes";
import type { StaticImageData } from "next/image";

export type HeroSlide = {
  id: string;
  href: string;
  image: StaticImageData;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "rich-flavor",
    href: ROUTES.shop,
    image: hero1,
  },
  {
    id: "latte-art",
    href: ROUTES.shop,
    image: hero2,
  },
  {
    id: "tea-moments",
    href: ROUTES.shop,
    image: hero3,
  },
];
