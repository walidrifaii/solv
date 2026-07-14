"use client";

import { useRef } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { CategoryCardItem } from "@/features/home/components/CategoryCardItem";
import { shopCategories } from "@/data/categories";

const SCROLL_AMOUNT = 260;

export function CategorySlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
      <button
        type="button"
        onClick={() => scrollByAmount("left")}
        className="flex size-9 shrink-0 items-center justify-center bg-transparent text-[#9a8b7c] transition-colors hover:text-[#2a1f16] sm:size-10"
        aria-label="Scroll categories left"
      >
        <ChevronLeftIcon className="size-5" />
      </button>

      <div
        ref={trackRef}
        className="no-scrollbar min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2"
      >
        <div className="flex gap-3 sm:gap-4">
          {shopCategories.map((category) => (
            <CategoryCardItem
              key={category.id}
              category={category}
              className="w-[11.5rem] shrink-0 snap-start sm:w-[13.5rem] md:w-[14.5rem]"
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount("right")}
        className="flex size-9 shrink-0 items-center justify-center bg-transparent text-[#9a8b7c] transition-colors hover:text-[#2a1f16] sm:size-10"
        aria-label="Scroll categories right"
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  );
}
