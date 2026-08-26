"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { slideHref } from "@/lib/slide-href";
import type { ApiPromoBanner } from "@/store/api/types";
import { useGetPromoBannersQuery } from "@/store/slices";

const AUTO_MS = 4000;
const DRAG_THRESHOLD = 6;

type LocalizedBanner = {
  id: string;
  href: string;
  imagePath: string;
  imageAlt: string;
};

function localizeBanner(
  banner: ApiPromoBanner,
  locale: Locale,
): LocalizedBanner {
  return {
    id: banner.id,
    href: slideHref(banner.categoryId, banner.href),
    imagePath: banner.imagePath,
    imageAlt: pickLocalized(locale, banner.imageAlt, banner.imageAltAr),
  };
}

export function PromoBanners() {
  const locale = useLocale() as Locale;
  const { data, isLoading, isError } = useGetPromoBannersQuery({ limit: 50 });
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const banners = useMemo(
    () =>
      (Array.isArray(data) ? data : []).map((item) =>
        localizeBanner(item, locale),
      ),
    [data, locale],
  );

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>("[data-promo-card]");
    if (!card) return 0;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    return card.offsetWidth + gap;
  }, []);

  const scrollNext = useCallback(() => {
    if (pausedRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const step = getStep();
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 8 || step <= 0) return;

    const rtl = getComputedStyle(track).direction === "rtl";
    const current = Math.abs(track.scrollLeft);
    const atEnd = current >= max - 8;

    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: rtl ? -step : step, behavior: "smooth" });
  }, [getStep]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setInterval(scrollNext, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [banners.length, scrollNext]);

  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = getStep();
    if (step <= 0) return;

    const rtl = getComputedStyle(track).direction === "rtl";
    const raw = rtl ? -track.scrollLeft : track.scrollLeft;
    const index = Math.round(raw / step);
    const target = index * step;
    track.scrollTo({ left: rtl ? -target : target, behavior: "smooth" });
  }, [getStep]);

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag.active || drag.pointerId !== event.pointerId) return;

      drag.active = false;
      const track = trackRef.current;
      track?.releasePointerCapture(event.pointerId);
      track?.classList.remove("cursor-grabbing");
      track?.classList.add("cursor-grab");
      if (drag.moved) snapToNearest();
      pausedRef.current = false;
    },
    [snapToNearest],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;

      const track = trackRef.current;
      if (!track) return;

      pausedRef.current = true;
      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        scrollLeft: track.scrollLeft,
        moved: false,
      };
      track.setPointerCapture(event.pointerId);
      track.classList.remove("cursor-grab");
      track.classList.add("cursor-grabbing");
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag.active || drag.pointerId !== event.pointerId) return;

      const track = trackRef.current;
      if (!track) return;

      const delta = event.clientX - drag.startX;
      if (Math.abs(delta) > DRAG_THRESHOLD) {
        drag.moved = true;
      }

      track.scrollLeft = drag.scrollLeft - delta;
      event.preventDefault();
    },
    [],
  );

  if (isLoading || isError || banners.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f5f0e8] px-2 pb-6 sm:px-3 sm:pb-8 md:px-4 md:pb-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          ref={trackRef}
          className="no-scrollbar flex cursor-grab gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth snap-x snap-mandatory sm:gap-4 md:gap-5"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
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
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              data-promo-card
              draggable={false}
              onClick={(event) => {
                if (dragRef.current.moved) {
                  event.preventDefault();
                  event.stopPropagation();
                  dragRef.current.moved = false;
                }
              }}
              className="group relative aspect-[16/9] w-full min-w-full shrink-0 snap-start overflow-hidden rounded-2xl bg-[#a5a196] sm:rounded-[1.25rem] lg:aspect-[2/1] lg:w-[calc((100%-1.25rem)/2)] lg:min-w-0"
            >
              <Image
                src={banner.imagePath}
                alt={banner.imageAlt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                draggable={false}
                className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
