import type { ApiProduct } from "@/store/api/types";
import type { ShopProduct } from "@/types/product";

/** Map API product → shop UI product shape */
export function mapApiProductToShop(product: ApiProduct): ShopProduct {
  const hasDiscount =
    product.discount != null && product.finalPrice < product.price;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.category?.name ?? "",
    description: product.description,
    longDescription: product.description,
    price: product.finalPrice,
    originalPrice: hasDiscount ? product.price : undefined,
    currency: "QAR",
    categoryId: product.categoryId,
    categoryLabel: product.category?.name ?? product.categoryId,
    image: product.imagePath,
    imageAlt: product.name,
    details: [],
    highlights: [],
    inStock: product.inStock,
    badges: product.isFeatured ? (["Featured"] as const) : undefined,
  };
}
