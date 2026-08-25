"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

const AUTO_MS = 4000;

type Props = {
  itemCount: number;
  children: ReactNode;
};

export function AutoHorizontalStrip({ itemCount, children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track || pausedRef.current) return;

    const card = track.querySelector<HTMLElement>("[data-strip-card]");
    if (!card) return;

    const row = track.firstElementChild;
    const styles = row ? window.getComputedStyle(row) : null;
    const gap = Number.parseFloat(styles?.columnGap || styles?.gap || "16") || 16;
    const step = card.offsetWidth + gap;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 8) return;

    const rtl = getComputedStyle(track).direction === "rtl";
    const current = Math.abs(track.scrollLeft);
    const atEnd = current >= max - 8;

    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: rtl ? -step : step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (itemCount <= 1) return;
    const timer = window.setInterval(scrollNext, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [itemCount, scrollNext]);

  return (
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
  );
}

export const stripCardClass =
  "w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]";
