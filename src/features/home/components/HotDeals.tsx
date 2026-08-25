"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import dealsBg from "@/assets/images/hot-deals-bg.png";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DealCard } from "@/features/home/components/DealCard";
import { hotDeals } from "@/features/home/data/deals";
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
    <section className="relative isolate overflow-hidden bg-[#a5a196] text-white">
      <Image
        src={dealsBg}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#a5a196]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5a196]/70 via-[#a5a196]/35 to-[#a5a196]/75" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-2 py-8 sm:px-3 sm:py-9 md:px-4 md:py-10">
        <div className="mx-auto mb-5 max-w-xl text-center sm:mb-6">
          <p className="font-serif text-xl leading-tight font-medium text-white sm:text-2xl md:text-[1.75rem]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1.5 font-serif text-2xl leading-tight font-medium text-white sm:text-3xl md:text-[2.25rem]">
            {t("title")}
          </h2>
          <div className="mt-2 flex justify-center text-[#C9A962]">
            <CoffeeBeansIcon className="size-5 sm:size-6" />
          </div>
          <p className="mt-2 text-xs text-white/80 sm:text-sm">
            {t("description")}
          </p>
          <Link
            href={hotDeals.href}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#C9A962] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#D9BC82] sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t("cta")}
            <ArrowRightIcon className="size-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {isLoading ? (
          <p className="py-5 text-center text-sm text-white/70">
            {tCommon("loading")}
          </p>
        ) : dealProducts.length === 0 ? (
          <p className="py-5 text-center text-sm text-white/70">
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
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/35 hover:bg-white/55"
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
