"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import dealsBg from "@/assets/images/hot-deals-bg.png";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DealCard } from "@/features/home/components/DealCard";
import { hotDeals } from "@/features/home/data/deals";
import { mapApiProductToShop } from "@/store/mappers/product";
import { useGetProductsQuery } from "@/store/slices";

const CARDS_PER_PAGE = 4;

export function HotDeals() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetProductsQuery({ limit: 48 });
  const dealProducts = useMemo(
    () =>
      (data ?? [])
        .filter(
          (product) =>
            product.discount != null && product.finalPrice < product.price,
        )
        .map(mapApiProductToShop),
    [data],
  );

  const pageCount = Math.max(1, Math.ceil(dealProducts.length / CARDS_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleProducts = dealProducts.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <section className="relative isolate overflow-hidden bg-[#17100a] text-white">
      <Image
        src={dealsBg}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#17100a]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#17100a]/70 via-[#17100a]/35 to-[#17100a]/75" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10 lg:py-18">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#c4a574] uppercase sm:text-xs">
            {hotDeals.eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-white sm:text-4xl md:text-[2.75rem]">
            {hotDeals.title}
          </h2>
          <div className="mt-3 flex justify-center text-[#c4a574]">
            <CoffeeBeansIcon className="size-7 sm:size-8" />
          </div>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            {hotDeals.description}
          </p>
          <Link
            href={hotDeals.cta.href}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#c4a574] px-6 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] sm:mt-7 sm:px-7 sm:py-3 sm:text-base"
          >
            {hotDeals.cta.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-white/70">Loading deals…</p>
        ) : dealProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/70">
            No deals available right now.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
              {visibleProducts.map((product) => (
                <DealCard
                  key={product.id}
                  product={product}
                  className="min-w-0 w-full"
                />
              ))}
            </div>

            {pageCount > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-2.5">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    aria-label={`Go to deals page ${i + 1}`}
                    aria-current={i === currentPage}
                    className={`h-2 rounded-full transition-all ${
                      i === currentPage
                        ? "w-7 bg-white"
                        : "w-2 bg-white/35 hover:bg-white/55"
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
