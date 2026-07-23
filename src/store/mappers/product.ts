import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import type { ApiProduct } from "@/store/api/types";
import type { ShopProduct } from "@/types/product";

/** Map API product → shop UI product shape (locale-aware names/descriptions). */
export function mapApiProductToShop(
  product: ApiProduct,
  locale: Locale = defaultLocale,
): ShopProduct {
  const hasDiscount =
    product.discount != null && product.finalPrice < product.price;
  const name = pickLocalized(locale, product.name, product.nameAr);
  const description = pickLocalized(
    locale,
    product.description,
    product.descriptionAr,
  );
  const categoryLabel = product.category
    ? pickLocalized(locale, product.category.name, product.category.nameAr)
    : product.categoryId;

  return {
    id: product.id,
    slug: product.slug,
    name,
    subtitle: categoryLabel,
    description,
    longDescription: description,
    price: product.finalPrice,
    originalPrice: hasDiscount ? product.price : undefined,
    currency: "QAR",
    categoryId: product.categoryId,
    categoryLabel,
    image: product.imagePath,
    imageAlt: name,
    details: [],
    highlights: [],
    inStock: product.inStock,
    badges: product.isFeatured ? (["Featured"] as const) : undefined,
  };
}
