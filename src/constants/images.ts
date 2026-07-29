import logo from "@/assets/images/logo.png";
import logoBlack from "@/assets/images/logo-black.png";
import hero from "@/assets/images/hero.png";
import hero2 from "@/assets/images/hero-2.png";
import hero3 from "@/assets/images/hero-3.png";

export const images = {
  logo,
  logoBlack,
  hero,
  heroes: [hero, hero2, hero3] as const,
} as const;
