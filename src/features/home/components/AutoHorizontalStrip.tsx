"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

const AUTO_MS = 4000;

type Props = {
  itemCount: number;
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
};

function getStep(track: HTMLDivElement) {
  const card = track.querySelector<HTMLElement>("[data-strip-card]");
  if (!card) return 0;
  const row = track.firstElementChild;
  const styles = row ? window.getComputedStyle(row) : null;
  const gap = Number.parseFloat(styles?.columnGap || styles?.gap || "16") || 16;
  return card.offsetWidth + gap;
}

export function AutoHorizontalStrip({
  itemCount,
  children,
  prevLabel,
  nextLabel,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const scrollByStep = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const step = getStep(track);
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 8 || step <= 0) return;

    const rtl = getComputedStyle(track).direction === "rtl";
    const current = Math.abs(track.scrollLeft);
    const atEnd = current >= max - 8;
    const atStart = current <= 8;

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === -1 && atStart) {
      track.scrollTo({ left: rtl ? -max : max, behavior: "smooth" });
      return;
    }

    const delta = (rtl ? -step : step) * direction;
    track.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    if (pausedRef.current) return;
    scrollByStep(1);
  }, [scrollByStep]);

  useEffect(() => {
    if (itemCount <= 1) return;
    const timer = window.setInterval(scrollNext, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [itemCount, scrollNext]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-1"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          pausedRef.current = false;
        }}
      >
        {children}
      </div>

      {itemCount > 1 ? (
        <>
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            className="absolute top-1/2 start-0 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#a5a196]/20 bg-[#FEF9F6]/90 text-[#a5a196] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:size-10"
            aria-label={prevLabel}
          >
            <ChevronLeftIcon className="size-4 sm:size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            className="absolute top-1/2 end-0 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#a5a196]/20 bg-[#FEF9F6]/90 text-[#a5a196] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:size-10"
            aria-label={nextLabel}
          >
            <ChevronRightIcon className="size-4 sm:size-5 rtl:rotate-180" />
          </button>
        </>
      ) : null}
    </div>
  );
}

export const stripCardClass =
  "w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]";
