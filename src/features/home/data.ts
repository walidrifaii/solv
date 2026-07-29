import { ROUTES } from "@/constants/routes";
import type { ApiHeroSlide } from "@/store/api/types";

/** Used when the slides API is unavailable or returns no active slides. */
export const fallbackHeroSlides: ApiHeroSlide[] = [
  {
    id: "rich-flavor",
    eyebrow: "Premium Coffee & Tea",
    eyebrowAr: "قهوة وشاي فاخر",
    title: "Rich Flavor, Perfect Moments",
    titleAr: "نكهة غنية، لحظات مثالية",
    description:
      "Discover our exclusive selection of premium coffee and tea blends, crafted for true taste lovers.",
    descriptionAr:
      "اكتشف مجموعتنا الحصرية من خلطات القهوة والشاي الفاخرة، المصممة لعشاق المذاق الأصيل.",
    ctaLabel: "Shop Now",
    ctaLabelAr: "تسوق الآن",
    imageAlt: "Black coffee cup with steam, beans, and a gold cezve",
    imageAltAr: "فنجان قهوة سوداء مع بخار وحبوب وجذوة ذهبية",
    imagePath: "/assets/hero-1.png",
    href: ROUTES.shop,
    sortOrder: 1,
  },
  {
    id: "latte-art",
    eyebrow: "Handcrafted Brews",
    eyebrowAr: "مشروبات حرفية",
    title: "Slow Sips, Golden Rituals",
    titleAr: "رشفات هادئة، طقوس ذهبية",
    description:
      "From silky espresso to delicate latte art, every cup is roasted and poured for depth, aroma, and calm.",
    descriptionAr:
      "من الإسبريسو الحريري إلى فن اللاتيه الرقيق، كل فنجان محمّص ومصبوب للعمق والرائحة والهدوء.",
    ctaLabel: "Shop Now",
    ctaLabelAr: "تسوق الآن",
    imageAlt: "Latte art in a black cup with coffee beans and gold spoon",
    imageAltAr: "فن لاتيه في فنجان أسود مع حبوب قهوة وملعقة ذهبية",
    imagePath: "/assets/hero-2.png",
    href: ROUTES.shop,
    sortOrder: 2,
  },
  {
    id: "tea-moments",
    eyebrow: "Tea & Warmth",
    eyebrowAr: "شاي ودفء",
    title: "Leaves, Steam, Quiet Luxury",
    titleAr: "أوراق، بخار، فخامة هادئة",
    description:
      "Explore refined tea blends and brewing rituals designed for evenings that linger a little longer.",
    descriptionAr:
      "استكشف خلطات شاي راقية وطقوس تحضير مصممة لأمسيات تدوم قليلاً أطول.",
    ctaLabel: "Shop Now",
    ctaLabelAr: "تسوق الآن",
    imageAlt: "Black teapot and teacup with steam and dried tea leaves",
    imageAltAr: "إبريق شاي أسود وفنجان مع بخار وأوراق شاي مجففة",
    imagePath: "/assets/hero-3.png",
    href: ROUTES.shop,
    sortOrder: 3,
  },
];
