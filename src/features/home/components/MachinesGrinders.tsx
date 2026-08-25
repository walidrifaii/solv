"use client";

import { useLocale, useTranslations } from "next-intl";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { FeaturedProductCard } from "@/features/home/components/FeaturedProductCard";
import { ROUTES } from "@/constants/routes";
import type { Locale } from "@/i18n/config";
import { mapApiProductToShop } from "@/store/mappers/product";
import { useGetProductsQuery } from "@/store/slices";
import Link from "next/link";

/** Shop category for Machines and Grinders / الأجهزة والمطاحن */
export const MACHINES_GRINDERS_CATEGORY_ID = "machines-grinders";

export function MachinesGrinders() {
  const t = useTranslations("home.machinesGrinders");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const { data, isLoading, isError } = useGetProductsQuery({
    categoryId: MACHINES_GRINDERS_CATEGORY_ID,
    limit: 24,
  });

  const products = (data ?? []).map((product) =>
    mapApiProductToShop(product, locale),
  );

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
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
          <div className="min-w-0">
            <p className="font-serif text-2xl leading-tight font-medium text-[#a5a196] sm:text-3xl md:text-[2rem]">
              {t("title")}
            </p>
            <p className="mt-1 text-sm text-[#7a6b5d] sm:text-base">
              {t("description")}
            </p>
            <div className="mt-3 flex items-center gap-3 text-[#C9A962]">
              <span className="h-px w-10 bg-[#C9A962]/70 sm:w-12" />
              <OrnamentIcon className="size-3 sm:size-3.5" />
              <span className="h-px w-10 bg-[#C9A962]/70 sm:w-12" />
            </div>
          </div>
          <Link
            href={ROUTES.shopCategory(MACHINES_GRINDERS_CATEGORY_ID)}
            className="text-sm font-medium text-[#C9A962] transition-colors hover:text-[#a5a196]"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="no-scrollbar -mx-0.5 overflow-x-auto scroll-smooth px-0.5 pb-1">
          <div className="flex gap-3 sm:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[min(11.5rem,72vw)] shrink-0 sm:w-[13rem] md:w-[14.5rem]"
              >
                <FeaturedProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
