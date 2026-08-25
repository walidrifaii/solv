"use client";

import { useLocale, useTranslations } from "next-intl";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { ShopProductCard } from "@/features/products/components/ShopProductCard";
import { ROUTES } from "@/constants/routes";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { mapApiProductToShop } from "@/store/mappers/product";
import {
  useGetCategoryByIdQuery,
  useGetProductsQuery,
} from "@/store/slices";
import Link from "next/link";

/** Shop category: Machines and Grinders / الأجهزة والمطاحن */
export const MACHINES_GRINDERS_CATEGORY_ID = "machines-grinders";

export function MachinesGrinders() {
  const t = useTranslations("home.machinesGrinders");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const { data: category } = useGetCategoryByIdQuery(
    MACHINES_GRINDERS_CATEGORY_ID,
  );
  const { data, isLoading, isError } = useGetProductsQuery({
    categoryId: MACHINES_GRINDERS_CATEGORY_ID,
    limit: 24,
  });

  const products = (data ?? []).map((product) =>
    mapApiProductToShop(product, locale),
  );

  const title = category
    ? pickLocalized(locale, category.name, category.nameAr)
    : t("title");

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

  if (isError || products.length === 0) {
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
            href={ROUTES.shopCategory(MACHINES_GRINDERS_CATEGORY_ID)}
            className="mt-3 inline-block text-sm font-medium text-[#C9A962] transition-colors hover:text-[#a5a196]"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="no-scrollbar overflow-x-auto scroll-smooth pb-1">
          <div className="flex gap-3 sm:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[min(14rem,78vw)] shrink-0 sm:w-[16rem] md:w-[17.5rem]"
              >
                <ShopProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
