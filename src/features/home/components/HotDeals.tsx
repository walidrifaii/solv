"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dealsBg from "@/assets/images/hot-deals-bg.png";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DealCard } from "@/features/home/components/DealCard";
import { dealProducts, hotDeals } from "@/features/home/data/deals";

export function HotDeals() {
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

    const card = track.querySelector<HTMLElement>("[data-deal-card]");
    const cardWidth = card?.offsetWidth ?? track.clientWidth;
    const visible = Math.max(1, Math.round(track.clientWidth / (cardWidth + 20)));
    const pages = Math.max(1, Math.ceil(dealProducts.length / visible));
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

  function goToPage(nextPage: number) {
    const track = trackRef.current;
    if (!track || pageCount <= 1) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const left = (nextPage / Math.max(1, pageCount - 1)) * maxScroll;
    track.scrollTo({ left, behavior: "smooth" });
  }

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

        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 sm:gap-5 lg:grid lg:grid-cols-3 lg:overflow-visible"
        >
          {dealProducts.map((product) => (
            <div
              key={product.id}
              data-deal-card
              className="w-[min(82vw,18rem)] shrink-0 snap-start sm:w-[16.5rem] md:w-[calc((100%-2.5rem)/2)] lg:w-auto lg:min-w-0"
            >
              <DealCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5 lg:hidden">
          {Array.from({ length: Math.max(pageCount, 3) }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`Go to deals page ${i + 1}`}
              aria-current={i === page}
              className={`h-2 rounded-full transition-all ${
                i === page
                  ? "w-7 bg-white"
                  : "w-2 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        <div className="mt-8 hidden items-center justify-center gap-2.5 lg:flex">
          <span className="h-2 w-7 rounded-full bg-white" />
          <span className="size-2 rounded-full bg-white/35" />
          <span className="size-2 rounded-full bg-white/35" />
        </div>
      </div>
    </section>
  );
}
