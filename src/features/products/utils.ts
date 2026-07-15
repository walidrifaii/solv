import { ROUTES } from "@/constants/routes";
import type { ShopProduct } from "@/types/product";

export function productPath(slug: string) {
  return `${ROUTES.shop}/${slug}`;
}

export function formatPrice(product: Pick<ShopProduct, "currency" | "price">) {
  return `${product.currency} ${product.price.toFixed(2)}`;
}

export function productImageSrc(image: ShopProduct["image"]) {
  return typeof image === "string" ? image : image.src;
}
