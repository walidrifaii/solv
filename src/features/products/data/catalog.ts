import arabica from "@/assets/images/product-arabica-beans.png";
import classicRoast from "@/assets/images/product-classic-roast.png";
import eveningTea from "@/assets/images/product-evening-tea.png";
import greenTea from "@/assets/images/product-green-tea.png";
import houseBlend from "@/assets/images/product-house-blend.png";
import teapot from "@/assets/images/product-teapot.png";
import dealEspresso from "@/assets/images/deal-espresso.png";
import dealGift from "@/assets/images/deal-gift.png";
import dealTea from "@/assets/images/deal-tea.png";
import type { ShopProduct } from "@/types/product";
import { ROUTES } from "@/constants/routes";

export const shopProductCategories = [
  { id: "all", label: "All" },
  { id: "coffee-beans", label: "Coffee Beans" },
  { id: "ground-coffee", label: "Ground Coffee" },
  { id: "tea", label: "Tea" },
  { id: "tea-bags", label: "Tea Bags" },
  { id: "accessories", label: "Accessories" },
  { id: "gift-sets", label: "Gift Sets" },
] as const;

export function productPath(slug: string) {
  return `${ROUTES.shop}/${slug}`;
}

export const shopProducts: ShopProduct[] = [
  {
    id: "arabica-beans",
    slug: "arabica-beans",
    name: "Premium Arabica Beans",
    subtitle: "100% Arabica · Whole Bean",
    description:
      "Smooth, aromatic Arabica beans selected for clean sweetness and everyday balance.",
    longDescription:
      "Our Premium Arabica Beans are curated for brightness without harsh edges — ideal for pour-over, drip, or French press. Roasted to highlight caramel notes and a soft finish that works from morning cups to café menus.",
    price: 69,
    currency: "QAR",
    categoryId: "coffee-beans",
    categoryLabel: "Coffee Beans",
    image: arabica,
    imageAlt: "Premium Arabica coffee beans bag",
    badges: ["Bestseller"],
    details: [
      { label: "Origin Profile", value: "Selected Arabica lots" },
      { label: "Roast", value: "Medium" },
      { label: "Format", value: "Whole bean" },
      { label: "Weight", value: "500g" },
    ],
    highlights: [
      "Balanced sweetness and aroma",
      "Suitable for most brew methods",
      "Packed for freshness",
    ],
    inStock: true,
  },
  {
    id: "house-blend",
    slug: "house-blend",
    name: "House Blend Beans",
    subtitle: "Dark Roast · Whole Bean",
    description:
      "A bold house blend with deep body and comforting roasted notes.",
    longDescription:
      "SOLV House Blend brings together carefully chosen beans for a richer cup — chocolate undertones, lasting finish, and enough intensity for espresso-style brewing or strong filter coffee.",
    price: 62,
    currency: "QAR",
    categoryId: "coffee-beans",
    categoryLabel: "Coffee Beans",
    image: houseBlend,
    imageAlt: "House blend coffee beans",
    details: [
      { label: "Roast", value: "Dark" },
      { label: "Format", value: "Whole bean" },
      { label: "Weight", value: "500g" },
      { label: "Best for", value: "Espresso & strong brew" },
    ],
    highlights: [
      "Full body and roast character",
      "Reliable everyday house coffee",
      "Great with milk drinks",
    ],
    inStock: true,
  },
  {
    id: "espresso-blend",
    slug: "espresso-blend",
    name: "Espresso Blend Coffee",
    subtitle: "1kg Bag · Whole Bean",
    description:
      "A café-style espresso blend designed for rich crema and consistent shots.",
    longDescription:
      "Built for volume and clarity under pressure, this espresso blend delivers chocolate depth with a smooth aftertaste. Ideal for home machines and hospitality setups looking for dependable extraction.",
    price: 60,
    originalPrice: 75,
    currency: "QAR",
    categoryId: "coffee-beans",
    categoryLabel: "Coffee Beans",
    image: dealEspresso,
    imageAlt: "Espresso blend coffee bag",
    badges: ["Hot Deal", "-20%"],
    details: [
      { label: "Roast", value: "Medium-Dark" },
      { label: "Format", value: "Whole bean" },
      { label: "Weight", value: "1kg" },
      { label: "Best for", value: "Espresso & milk drinks" },
    ],
    highlights: [
      "Café-ready espresso profile",
      "Stable crema and body",
      "Value 1kg format",
    ],
    inStock: true,
  },
  {
    id: "classic-roast",
    slug: "classic-roast",
    name: "Classic Roast Ground Coffee",
    subtitle: "Medium Roast · Ready to Brew",
    description:
      "Convenient ground coffee with a classic medium roast profile.",
    longDescription:
      "Freshly ground for drip and French press convenience, Classic Roast offers round flavor and gentle acidity — a dependable pantry staple for homes and offices across Qatar.",
    price: 55,
    currency: "QAR",
    categoryId: "ground-coffee",
    categoryLabel: "Ground Coffee",
    image: classicRoast,
    imageAlt: "Classic roast ground coffee tin",
    details: [
      { label: "Roast", value: "Medium" },
      { label: "Format", value: "Ground" },
      { label: "Weight", value: "400g" },
      { label: "Best for", value: "Drip & French press" },
    ],
    highlights: [
      "No grinding required",
      "Smooth classic cup",
      "Everyday convenience",
    ],
    inStock: true,
  },
  {
    id: "green-tea",
    slug: "green-tea",
    name: "Green Tea Sencha",
    subtitle: "Japanese Sencha · Loose Leaf",
    description:
      "Delicate sencha with fresh vegetal notes and a clean finish.",
    longDescription:
      "A refined loose-leaf sencha for quieter moments — light body, soft sweetness, and a bright finish. Best steeped gently to preserve aroma and clarity.",
    price: 49,
    currency: "QAR",
    categoryId: "tea",
    categoryLabel: "Tea",
    image: greenTea,
    imageAlt: "Green tea sencha tin",
    badges: ["New"],
    details: [
      { label: "Style", value: "Sencha" },
      { label: "Format", value: "Loose leaf" },
      { label: "Weight", value: "100g" },
      { label: "Steep", value: "70–80°C · 1–2 min" },
    ],
    highlights: [
      "Clean, aromatic green tea",
      "Ideal afternoon cup",
      "Carefully packed leaves",
    ],
    inStock: true,
  },
  {
    id: "english-breakfast",
    slug: "english-breakfast",
    name: "English Breakfast Tea",
    subtitle: "Loose Leaf · 500g",
    description:
      "A robust breakfast blend with malty depth and satisfying body.",
    longDescription:
      "Bold enough for milk, clear enough on its own — our English Breakfast leaf tea is a morning staple for homes and hospitality service.",
    price: 46.75,
    originalPrice: 55,
    currency: "QAR",
    categoryId: "tea",
    categoryLabel: "Tea",
    image: dealTea,
    imageAlt: "English breakfast tea tin",
    badges: ["Hot Deal", "-15%"],
    details: [
      { label: "Style", value: "Black tea blend" },
      { label: "Format", value: "Loose leaf" },
      { label: "Weight", value: "500g" },
      { label: "Steep", value: "95°C · 3–4 min" },
    ],
    highlights: [
      "Full breakfast character",
      "Works with or without milk",
      "Larger 500g format",
    ],
    inStock: true,
  },
  {
    id: "evening-tea",
    slug: "evening-tea",
    name: "Evening Tea Bags",
    subtitle: "Herbal Blend · Caffeine-light",
    description:
      "A calming herbal blend for late-day rituals and quieter evenings.",
    longDescription:
      "Soft botanicals and a gentle finish make Evening Tea Bags an easy wind-down choice — ready to steep with no loose-leaf mess.",
    price: 39,
    currency: "QAR",
    categoryId: "tea-bags",
    categoryLabel: "Tea Bags",
    image: eveningTea,
    imageAlt: "Evening herbal tea bags",
    details: [
      { label: "Style", value: "Herbal blend" },
      { label: "Format", value: "Tea bags" },
      { label: "Count", value: "20 bags" },
      { label: "Steep", value: "95°C · 4–5 min" },
    ],
    highlights: [
      "Soft evening flavor",
      "Convenient tea bags",
      "Gentle daily ritual",
    ],
    inStock: true,
  },
  {
    id: "elegant-teapot",
    slug: "elegant-teapot",
    name: "Elegant Tea Pot",
    subtitle: "Glass & Stainless Steel",
    description:
      "A clear glass teapot with stainless infuser for beautiful table brewing.",
    longDescription:
      "Watch the leaves bloom while you steep. Heat-resistant glass meets a fine stainless infuser for loose-leaf teas at home or in café display service.",
    price: 120,
    currency: "QAR",
    categoryId: "accessories",
    categoryLabel: "Accessories",
    image: teapot,
    imageAlt: "Glass teapot with metal infuser",
    badges: ["Featured"],
    details: [
      { label: "Material", value: "Glass & stainless steel" },
      { label: "Capacity", value: "Approx. 800ml" },
      { label: "Includes", value: "Removable infuser" },
      { label: "Care", value: "Hand wash recommended" },
    ],
    highlights: [
      "Elegant serving piece",
      "Built-in infuser",
      "Ideal for loose leaf",
    ],
    inStock: true,
  },
  {
    id: "coffee-gift-set",
    slug: "coffee-gift-set",
    name: "Coffee Gift Set",
    subtitle: "Premium Set · Perfect for Gifting",
    description:
      "A ready-to-give coffee assortment packaged for clients, hosts, and celebrations.",
    longDescription:
      "Thoughtfully assembled for memorable gifting — premium coffee selections presented with SOLV care. Ideal for corporate offerings, hospitality amenities, and personal thank-yous.",
    price: 90,
    originalPrice: 120,
    currency: "QAR",
    categoryId: "gift-sets",
    categoryLabel: "Gift Sets",
    image: dealGift,
    imageAlt: "Coffee gift set",
    badges: ["Hot Deal", "-25%"],
    details: [
      { label: "Includes", value: "Curated coffee selection" },
      { label: "Presentation", value: "Gift-ready packaging" },
      { label: "Best for", value: "Corporate & personal gifts" },
      { label: "Origin", value: "SOLV curated" },
    ],
    highlights: [
      "Gift-ready presentation",
      "Premium coffee focus",
      "Limited-time value",
    ],
    inStock: true,
  },
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId?: string): ShopProduct[] {
  if (!categoryId || categoryId === "all") return shopProducts;
  return shopProducts.filter((product) => product.categoryId === categoryId);
}

export function getRelatedProducts(
  product: ShopProduct,
  limit = 4,
): ShopProduct[] {
  const sameCategory = shopProducts.filter(
    (item) =>
      item.slug !== product.slug && item.categoryId === product.categoryId,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = shopProducts.filter(
    (item) =>
      item.slug !== product.slug &&
      !sameCategory.some((related) => related.slug === item.slug),
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function formatPrice(product: Pick<ShopProduct, "currency" | "price">) {
  return `${product.currency} ${product.price.toFixed(2)}`;
}
