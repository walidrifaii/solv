"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { ShopProductCard } from "@/features/products/components/ShopProductCard";
import { ROUTES } from "@/constants/routes";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { mapApiProductToShop } from "@/store/mappers/product";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/store/slices";
import Link from "next/link";
import { AutoHorizontalStrip, stripCardClass } from "@/features/home/components/AutoHorizontalStrip";

const CATEGORY_MATCHERS = [
  "machines-grinders",
  "machines-and-grinders",
  "machines and grinders",
  "الأجهزة والمطاحن",
];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function MachinesGrinders() {
  const t = useTranslations("home.machinesGrinders");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const { data: categories = [], isLoading: loadingCategories } =
    useGetCategoriesQuery({ limit: 50 });

  const category = useMemo(() => {
    const matchers = CATEGORY_MATCHERS.map(normalize);
    return (
      categories.find((item) => {
        const candidates = [item.id, item.slug, item.name, item.nameAr ?? ""].map(
          normalize,
        );
        return candidates.some((value) => matchers.includes(value));
      }) ?? null
    );
  }, [categories]);

  const categoryId = category?.id;

  const { data, isLoading: loadingProducts, isError } = useGetProductsQuery(
    { categoryId: categoryId!, limit: 24 },
    { skip: !categoryId },
  );

  const products = (data ?? []).map((product) =>
    mapApiProductToShop(product, locale),
  );

  const title = category
    ? pickLocalized(locale, category.name, category.nameAr)
    : t("title");

  const isLoading = loadingCategories || (!!categoryId && loadingProducts);

  if (isLoading) {
    return (
      <section className="bg-[#f5f0e8] px-2 py-8 text-[#a5a196] sm:px-3 sm:py-10 md:px-4 md:py-12">
        <div className="mx-auto w-full max-w-[1600px]">
          <p className="py-6 text-center text-sm text-[#7a6b5d]">
            {tCommon("loading")}
          </p>
        </div>
      </section>
    );
  }

  if (!categoryId || isError || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f5f0e8] px-2 py-8 text-[#a5a196] sm:px-3 sm:py-10 md:px-4 md:py-12">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <h2 className="font-serif text-2xl leading-tight font-medium text-[#a5a196] sm:text-3xl md:text-[2.5rem]">
            {title}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-[#C9A962]">
            <span className="h-px w-10 bg-[#C9A962]/70 sm:w-14" />
            <OrnamentIcon className="size-3 sm:size-3.5" />
            <span className="h-px w-10 bg-[#C9A962]/70 sm:w-14" />
          </div>
          <Link
            href={ROUTES.shopCategory(categoryId)}
            className="mt-3 inline-block text-sm font-medium text-[#C9A962] transition-colors hover:text-[#a5a196]"
          >
            {t("viewAll")}
          </Link>
        </div>

        <AutoHorizontalStrip itemCount={products.length}>
          <div className="flex gap-3 pe-1 sm:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                data-strip-card
                className={stripCardClass}
              >
                <ShopProductCard product={product} />
              </div>
            ))}
          </div>
        </AutoHorizontalStrip>
      </div>
    </section>
  );
}
