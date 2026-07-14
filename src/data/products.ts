import type { Product } from "@/types/product";
import productsJson from "@/data/products.json";

export const products: Product[] = productsJson.map((item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  categoryId: item.categoryId,
}));
