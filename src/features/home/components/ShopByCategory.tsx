"use client";

import { useLocale, useTranslations } from "next-intl";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { CategoryCardItem } from "@/features/home/components/CategoryCardItem";
import { shopCategories, type CategoryCard } from "@/data/categories";
import { ROUTES } from "@/constants/routes";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import type { ApiCategory } from "@/store/api/types";
import { useGetCategoriesQuery } from "@/store/slices";

function mapApiCategory(category: ApiCategory, locale: Locale): CategoryCard {
  const name = pickLocalized(locale, category.name, category.nameAr);
  return {
    id: category.id,
    name,
    href: `${ROUTES.shop}?category=${category.id}`,
    // Use imagePath from API response
    imagePath: category.imagePath || `/assets/category-${category.id}.png`,
    imageAlt: name,
  };
}

export function ShopByCategory() {
  const t = useTranslations("home.shopByCategory");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const { data, isLoading, isError } = useGetCategoriesQuery({ limit: 20 });

  const categories: CategoryCard[] =
    !isError && data && data.length > 0
      ? data.map((category) => mapApiCategory(category, locale))
      : shopCategories;

  return (
    <section className="bg-[#FEF9F6] px-4 py-14 text-[#2a1f16] sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 md:mb-14">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
            {t("title")}
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#c4a574]">
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
          </div>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-[#7a6b5d]">
            {tCommon("loading")}
          </p>
        ) : (
          <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 md:gap-x-8 lg:max-w-none lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-center">
                <CategoryCardItem category={category} className="w-full" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
