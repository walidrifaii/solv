"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { fallbackHeroSlides } from "@/features/home/data";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { slideHref } from "@/lib/slide-href";
import type { ApiHeroSlide } from "@/store/api/types";
import { useGetSlidesQuery } from "@/store/slices/slides/slidesApi";

const AUTO_MS = 6500;

type LocalizedSlide = {
  id: string;
  href: string;
  imagePath: string;
  imageAlt: string;
};

function localizeSlide(slide: ApiHeroSlide, locale: Locale): LocalizedSlide {
  return {
    id: slide.id,
    href: slideHref(slide.categoryId, slide.href),
    imagePath: slide.imagePath,
    imageAlt: pickLocalized(locale, slide.imageAlt, slide.imageAltAr),
  };
}

export function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale() as Locale;
  const { data, isLoading, isError } = useGetSlidesQuery({ limit: 20 });
  const [index, setIndex] = useState(0);

  const apiSlides: ApiHeroSlide[] = Array.isArray(data) ? data : [];
  const sourceSlides =
    !isError && apiSlides.length > 0 ? apiSlides : fallbackHeroSlides;
  const slides = sourceSlides.map((item) => localizeSlide(item, locale));
  const count = slides.length;
  const safeIndex = count === 0 ? 0 : index % count;
  const slide = count > 0 ? slides[safeIndex] : null;

  useEffect(() => {
    setIndex(0);
  }, [sourceSlides.length, locale]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [count, safeIndex]);

  function goTo(next: number) {
    if (count === 0) return;
    setIndex((next + count) % count);
  }

  const frameClass =
    "relative isolate min-h-[42svh] w-full overflow-hidden rounded-[1.5rem] bg-[#a5a196] sm:min-h-[50svh] sm:rounded-[1.75rem] md:aspect-[1871/840] md:min-h-0";

  if (isLoading && apiSlides.length === 0) {
    return (
      <section className="px-3 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className={frameClass} />
        </div>
      </section>
    );
  }

  if (!slide || count === 0) {
    return null;
  }

  return (
    <section className="px-3 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className={`${frameClass} text-white`}>
          {slides.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === safeIndex
                  ? "z-[1] opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
              aria-hidden={i !== safeIndex}
              tabIndex={i === safeIndex ? 0 : -1}
            >
              <Image
                src={item.imagePath}
                alt={item.imageAlt}
                fill
                priority={i === 0}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-[72%_center] sm:object-[68%_center] md:object-center"
              />
            </Link>
          ))}

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  goTo(safeIndex - 1);
                }}
                className="absolute top-1/2 start-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#a5a196]/50 text-white backdrop-blur-sm transition-colors hover:bg-[#a5a196]/75 sm:start-3 sm:size-10 md:start-5 md:size-12"
                aria-label={t("prev")}
              >
                <ChevronLeftIcon className="size-4 sm:size-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  goTo(safeIndex + 1);
                }}
                className="absolute top-1/2 end-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#a5a196]/50 text-white backdrop-blur-sm transition-colors hover:bg-[#a5a196]/75 sm:end-3 sm:size-10 md:end-5 md:size-12"
                aria-label={t("next")}
              >
                <ChevronRightIcon className="size-4 sm:size-5 rtl:rotate-180" />
              </button>

              <div className="absolute bottom-4 start-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-5 md:bottom-6 md:gap-2.5">
                {slides.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(i);
                    }}
                    aria-label={`${i + 1}`}
                    aria-current={i === safeIndex}
                    className={`h-1.5 rounded-full transition-all sm:h-2 ${
                      i === safeIndex
                        ? "w-6 bg-white sm:w-8"
                        : "w-1.5 bg-white/35 hover:bg-white/60 sm:w-2"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
