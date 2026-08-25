"use client";

import { useLocale, useTranslations } from "next-intl";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { FeaturedProductCard } from "@/features/home/components/FeaturedProductCard";
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
          <div className="no-scrollbar overflow-x-auto scroll-smooth pb-1">
            <div className="flex gap-3 sm:gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-[min(14rem,78vw)] shrink-0 sm:w-[16rem] md:w-[17.5rem]"
                >
                  <FeaturedProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
