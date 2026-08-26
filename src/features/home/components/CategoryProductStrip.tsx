"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import {
  AutoHorizontalStrip,
  stripCardClass,
} from "@/features/home/components/AutoHorizontalStrip";
import { ShopProductCard } from "@/features/products/components/ShopProductCard";
import { ROUTES } from "@/constants/routes";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { mapApiProductToShop } from "@/store/mappers/product";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/store/slices";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

type Props = {
  matchers: readonly string[];
  fallbackTitle: string;
  viewAllLabel: string;
  prevLabel: string;
  nextLabel: string;
  /** Section background class, e.g. bg-[#f5f0e8] */
  sectionBgClass?: string;
};

export function CategoryProductStrip({
  matchers,
  fallbackTitle,
  viewAllLabel,
  prevLabel,
  nextLabel,
  sectionBgClass = "bg-[#f5f0e8]",
}: Props) {
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const { data: categories = [], isLoading: loadingCategories } =
    useGetCategoriesQuery({ limit: 50 });

  const category = useMemo(() => {
    const normalizedMatchers = matchers.map(normalize);
    return (
      categories.find((item) => {
        const candidates = [
          item.id,
          item.slug,
          item.name,
          item.nameAr ?? "",
        ].map(normalize);
        return candidates.some((value) => normalizedMatchers.includes(value));
      }) ?? null
    );
  }, [categories, matchers]);

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
    : fallbackTitle;

  const isLoading = loadingCategories || (!!categoryId && loadingProducts);
  const sectionClass = `${sectionBgClass} px-2 py-8 text-[#a5a196] sm:px-3 sm:py-10 md:px-4 md:py-12`;

  if (isLoading) {
    return (
      <section className={sectionClass}>
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
    <section className={sectionClass}>
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
            className="mt-5 inline-flex items-center justify-center rounded-md border border-[#C9A962] bg-[#C9A962]/12 px-5 py-2 text-sm font-medium text-[#C9A962] transition-colors hover:bg-[#C9A962] hover:text-white sm:mt-6 sm:px-6 sm:py-2.5"
          >
            {viewAllLabel}
          </Link>
        </div>

        <AutoHorizontalStrip
          itemCount={products.length}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        >
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
