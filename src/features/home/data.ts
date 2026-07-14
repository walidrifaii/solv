import hero1 from "@/assets/images/hero.png";
import hero2 from "@/assets/images/hero-2.png";
import hero3 from "@/assets/images/hero-3.png";
import { ROUTES } from "@/constants/routes";
import type { StaticImageData } from "next/image";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  image: StaticImageData;
  imageAlt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "rich-flavor",
    eyebrow: "Premium Coffee & Tea",
    title: "Rich Flavor, Perfect Moments",
    description:
      "Discover our exclusive selection of premium coffee and tea blends, crafted for true taste lovers.",
    cta: { label: "Shop Now", href: ROUTES.shop },
    image: hero1,
    imageAlt: "Black coffee cup with steam, beans, and a gold cezve",
  },
  {
    id: "latte-art",
    eyebrow: "Handcrafted Brews",
    title: "Slow Sips, Golden Rituals",
    description:
      "From silky espresso to delicate latte art, every cup is roasted and poured for depth, aroma, and calm.",
    cta: { label: "Shop Now", href: ROUTES.shop },
    image: hero2,
    imageAlt: "Latte art in a black cup with coffee beans and gold spoon",
  },
  {
    id: "tea-moments",
    eyebrow: "Tea & Warmth",
    title: "Leaves, Steam, Quiet Luxury",
    description:
      "Explore refined tea blends and brewing rituals designed for evenings that linger a little longer.",
    cta: { label: "Shop Now", href: ROUTES.shop },
    image: hero3,
    imageAlt: "Black teapot and teacup with steam and dried tea leaves",
  },
];
