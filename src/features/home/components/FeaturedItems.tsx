"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { FeaturedProductCard } from "@/features/home/components/FeaturedProductCard";
import type { Locale } from "@/i18n/config";
import { mapApiProductToShop } from "@/store/mappers/product";
import { useGetProductsQuery } from "@/store/slices";

export function FeaturedItems() {
  const t = useTranslations("home.featured");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const { data, isLoading } = useGetProductsQuery({
    featured: true,
    limit: 12,
  });
  const products = (data ?? []).map((product) =>
    mapApiProductToShop(product, locale),
  );

  function getPageMetrics() {
    const track = trackRef.current;
    if (!track) return null;

    const row = track.firstElementChild;
    if (!row) return null;

    const card = track.querySelector<HTMLElement>("[data-featured-card]");
    const cardWidth = card?.offsetWidth ?? track.clientWidth;
    const styles = window.getComputedStyle(row);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    const visible = Math.max(
      1,
      Math.round((track.clientWidth + gap) / (cardWidth + gap)),
    );
    const pageSize = cardWidth * visible + gap * Math.max(0, visible - 1);
    const pages = Math.max(1, Math.ceil(products.length / visible));

    return { track, pageSize, pages, visible };
  }

  function updatePagination() {
    const metrics = getPageMetrics();
    if (!metrics) return;

    const { track, pageSize, pages } = metrics;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 8) {
      setPageCount(1);
      setPage(0);
      return;
    }

    setPageCount(pages);
    setPage(
      Math.min(pages - 1, Math.round(track.scrollLeft / Math.max(pageSize, 1))),
    );
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updatePagination();
    track.addEventListener("scroll", updatePagination, { passive: true });
    window.addEventListener("resize", updatePagination);
    return () => {
      track.removeEventListener("scroll", updatePagination);
      window.removeEventListener("resize", updatePagination);
    };
  }, [products.length]);

  function scrollByDirection(direction: "left" | "right") {
    const metrics = getPageMetrics();
    if (!metrics) return;
    const { track, pageSize } = metrics;
    track.scrollBy({
      left: direction === "left" ? -pageSize : pageSize,
      behavior: "smooth",
    });
  }

  function goToPage(nextPage: number) {
    const metrics = getPageMetrics();
    if (!metrics || pageCount <= 1) return;
    const { track, pageSize } = metrics;
    track.scrollTo({ left: nextPage * pageSize, behavior: "smooth" });
  }

  return (
    <section className="bg-[#FEF9F6] px-4 pt-6 pb-14 text-[#a5a196] sm:px-6 sm:pt-8 sm:pb-16 md:px-8 md:pt-8 md:pb-20 lg:px-10 lg:pt-10 lg:pb-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#a5a196] sm:text-4xl md:text-[2.75rem]">
            {t("eyebrow")}
          </h2>
          <p className="mt-3 font-serif text-[18px] leading-tight font-medium text-[#a5a196]">
            {t("title")}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#C9A962]">
            <span className="h-px w-12 bg-[#C9A962]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#C9A962]/70 sm:w-16" />
          </div>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-[#7a6b5d]">
            {tCommon("loading")}
          </p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#7a6b5d]">
            {t("empty")}
          </p>
        ) : (
          <>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <button
                type="button"
                onClick={() => scrollByDirection("left")}
                className="flex size-9 shrink-0 items-center justify-center bg-transparent text-[#9a8b7c] transition-colors hover:text-[#a5a196] sm:size-10"
                aria-label={t("prev")}
              >
                <ChevronLeftIcon className="size-5 sm:size-6 rtl:rotate-180" />
              </button>

              <div
                ref={trackRef}
                className="no-scrollbar min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1"
              >
                <div className="flex gap-3 sm:gap-4 md:gap-5">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      data-featured-card
                      className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
                    >
                      <FeaturedProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollByDirection("right")}
                className="flex size-9 shrink-0 items-center justify-center bg-transparent text-[#9a8b7c] transition-colors hover:text-[#a5a196] sm:size-10"
                aria-label={t("next")}
              >
                <ChevronRightIcon className="size-5 sm:size-6 rtl:rotate-180" />
              </button>
            </div>

            {pageCount > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-2.5">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToPage(i)}
                    aria-label={`${i + 1}`}
                    aria-current={i === page}
                    className={`h-2 rounded-full transition-all ${
                      i === page
                        ? "w-2 bg-[#a5a196]"
                        : "w-2 bg-[#a5a196]/25 hover:bg-[#a5a196]/45"
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
