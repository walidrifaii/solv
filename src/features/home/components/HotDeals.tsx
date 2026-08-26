"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { DealCard } from "@/features/home/components/DealCard";
import type { Locale } from "@/i18n/config";
import { mapApiProductToShop } from "@/store/mappers/product";
import { useGetProductsQuery } from "@/store/slices";

const CARDS_PER_PAGE = 4;

export function HotDeals() {
  const t = useTranslations("home.deals");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetProductsQuery({ limit: 48 });
  const dealProducts = useMemo(
    () =>
      (data ?? [])
        .filter(
          (product) =>
            product.discount != null && product.finalPrice < product.price,
        )
        .map((product) => mapApiProductToShop(product, locale)),
    [data, locale],
  );

  const pageCount = Math.max(1, Math.ceil(dealProducts.length / CARDS_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleProducts = dealProducts.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <section className="bg-[#f5f0e8] px-2 py-8 sm:px-3 sm:py-9 md:px-4 md:py-10">
      <div className="mx-auto w-full max-w-[1600px]">
        {isLoading ? (
          <p className="py-5 text-center text-sm text-[#7a6b5d]">
            {tCommon("loading")}
          </p>
        ) : dealProducts.length === 0 ? (
          <p className="py-5 text-center text-sm text-[#7a6b5d]">
            {t("empty")}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <DealCard
                  key={product.id}
                  product={product}
                  className="min-w-0 w-full"
                />
              ))}
            </div>

            {pageCount > 1 ? (
              <div className="mt-5 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    aria-label={`${i + 1}`}
                    aria-current={i === currentPage}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentPage
                        ? "w-5 bg-[#C9A962]"
                        : "w-1.5 bg-[#a5a196]/30 hover:bg-[#a5a196]/50"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
