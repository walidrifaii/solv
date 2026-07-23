"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/constants/routes";
import { ProductDetailView } from "@/features/products/components/ProductDetailView";
import type { Locale } from "@/i18n/config";
import { mapApiProductToShop } from "@/store/mappers/product";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "@/store/slices";

type ProductDetailContainerProps = {
  slug: string;
};

export function ProductDetailContainer({ slug }: ProductDetailContainerProps) {
  const t = useTranslations("shop");
  const locale = useLocale() as Locale;
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductBySlugQuery(slug);

  const { data: relatedRaw } = useGetProductsQuery(
    {
      categoryId: product?.categoryId,
      limit: 8,
    },
    { skip: !product?.categoryId },
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
        {t("loadingProduct")}
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#FEF9F6] px-4 py-24 text-center">
        <p className="font-serif text-2xl text-[#2a1f16]">{t("productNotFound")}</p>
        <Link
          href={ROUTES.shop}
          className="mt-4 text-sm text-[#c4a574] underline"
        >
          {t("backToShop")}
        </Link>
      </div>
    );
  }

  const shopProduct = mapApiProductToShop(product, locale);
  const related = (relatedRaw ?? [])
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4)
    .map((item) => mapApiProductToShop(item, locale));

  return <ProductDetailView product={shopProduct} related={related} />;
}
