import type { Product } from "@/types/product";
import { featuredProducts } from "@/features/home/data/featured";

export const products: Product[] = featuredProducts.map((item) => ({
  id: item.id,
  name: item.name,
  description: item.subtitle,
  price: item.price,
  categoryId: item.id.includes("tea") ? "tea" : "coffee-beans",
}));
