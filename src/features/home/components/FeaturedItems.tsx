"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { FeaturedProductCard } from "@/features/home/components/FeaturedProductCard";
import { featuredProducts } from "@/features/home/data/featured";

export function FeaturedItems() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  function updatePagination() {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 8) {
      setPageCount(1);
      setPage(0);
      return;
    }

    const card = track.querySelector<HTMLElement>("[data-featured-card]");
    const cardWidth = card?.offsetWidth ?? track.clientWidth;
    const gap = 20;
    const visible = Math.max(1, Math.round(track.clientWidth / (cardWidth + gap)));
    const pages = Math.max(1, Math.ceil(featuredProducts.length / visible));
    setPageCount(pages);

    const progress = track.scrollLeft / maxScroll;
    setPage(Math.min(pages - 1, Math.round(progress * (pages - 1))));
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
  }, []);

  function scrollByDirection(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-featured-card]");
    const amount = (card?.offsetWidth ?? 280) + 20;
    track.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  function goToPage(nextPage: number) {
    const track = trackRef.current;
    if (!track || pageCount <= 1) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const left = (nextPage / (pageCount - 1)) * maxScroll;
    track.scrollTo({ left, behavior: "smooth" });
  }

  return (
    <section className="bg-[#FEF9F6] px-4 py-14 text-[#2a1f16] sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 md:mb-14">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            Our Selection
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
            Featured Items
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#c4a574]">
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => scrollByDirection("left")}
            className="flex size-9 shrink-0 items-center justify-center bg-transparent text-[#9a8b7c] transition-colors hover:text-[#2a1f16] sm:size-10"
            aria-label="Previous featured items"
          >
            <ChevronLeftIcon className="size-5 sm:size-6" />
          </button>

          <div
            ref={trackRef}
            className="no-scrollbar min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1"
          >
            <div className="flex gap-4 sm:gap-5">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  data-featured-card
                  className="w-[min(78vw,17.5rem)] shrink-0 snap-start sm:w-[16.5rem] md:w-[calc((100%-3.75rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
                >
                  <FeaturedProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollByDirection("right")}
            className="flex size-9 shrink-0 items-center justify-center bg-transparent text-[#9a8b7c] transition-colors hover:text-[#2a1f16] sm:size-10"
            aria-label="Next featured items"
          >
            <ChevronRightIcon className="size-5 sm:size-6" />
          </button>
        </div>

        {pageCount > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Go to featured page ${i + 1}`}
                aria-current={i === page}
                className={`h-2 rounded-full transition-all ${
                  i === page
                    ? "w-2 bg-[#2a1f16]"
                    : "w-2 bg-[#2a1f16]/25 hover:bg-[#2a1f16]/45"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
