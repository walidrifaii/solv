"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { AutoHorizontalStrip, stripCardClass } from "@/features/home/components/AutoHorizontalStrip";
import { FeaturedProductCard } from "@/features/home/components/FeaturedProductCard";
import { ROUTES } from "@/constants/routes";
import type { Locale } from "@/i18n/config";
import { mapApiProductToShop } from "@/store/mappers/product";
import { useGetProductsQuery } from "@/store/slices";

export function FeaturedItems() {
  const t = useTranslations("home.featured");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const { data, isLoading } = useGetProductsQuery({
    featured: true,
    limit: 12,
  });
  const products = (data ?? []).map((product) =>
    mapApiProductToShop(product, locale),
  );

  return (
    <section className="bg-[#f5f0e8] px-2 py-8 text-[#a5a196] sm:px-3 sm:py-10 md:px-4 md:py-12">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <p className="font-serif text-2xl leading-tight font-medium text-[#a5a196] sm:text-3xl md:text-[2.5rem]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight font-medium text-[#a5a196] sm:text-3xl md:text-[2.5rem]">
            {t("title")}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-[#C9A962]">
            <span className="h-px w-10 bg-[#C9A962]/70 sm:w-14" />
            <OrnamentIcon className="size-3 sm:size-3.5" />
            <span className="h-px w-10 bg-[#C9A962]/70 sm:w-14" />
          </div>
          <Link
            href={ROUTES.shop}
            className="mt-5 inline-flex items-center justify-center rounded-md border border-[#C9A962] bg-[#C9A962]/12 px-5 py-2 text-sm font-medium text-[#C9A962] transition-colors hover:bg-[#C9A962] hover:text-white sm:mt-6 sm:px-6 sm:py-2.5"
          >
            {t("viewAll")}
          </Link>
        </div>

        {isLoading ? (
          <p className="py-6 text-center text-sm text-[#7a6b5d]">
            {tCommon("loading")}
          </p>
        ) : products.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#7a6b5d]">
            {t("empty")}
          </p>
        ) : (
          <AutoHorizontalStrip
            itemCount={products.length}
            prevLabel={t("prev")}
            nextLabel={t("next")}
          >
            <div className="flex gap-3 pe-1 sm:gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  data-strip-card
                  className={stripCardClass}
                >
                  <FeaturedProductCard product={product} />
                </div>
              ))}
            </div>
          </AutoHorizontalStrip>
        )}
      </div>
    </section>
  );
}
