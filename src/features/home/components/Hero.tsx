"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { fallbackHeroSlides } from "@/features/home/data";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import type { ApiHeroSlide } from "@/store/api/types";
import { useGetSlidesQuery } from "@/store/slices/slides/slidesApi";

const AUTO_MS = 6500;

type LocalizedSlide = {
  id: string;
  href: string;
  imagePath: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  imageAlt: string;
};

function localizeSlide(slide: ApiHeroSlide, locale: Locale): LocalizedSlide {
  return {
    id: slide.id,
    href: slide.href,
    imagePath: slide.imagePath,
    eyebrow: pickLocalized(locale, slide.eyebrow, slide.eyebrowAr),
    title: pickLocalized(locale, slide.title, slide.titleAr),
    description: pickLocalized(locale, slide.description, slide.descriptionAr),
    ctaLabel: pickLocalized(locale, slide.ctaLabel, slide.ctaLabelAr),
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

  if (isLoading && apiSlides.length === 0) {
    return (
      <section className="relative isolate min-h-[42svh] w-full overflow-hidden bg-[#a5a196] sm:min-h-[50svh] md:aspect-[1871/840] md:min-h-0" />
    );
  }

  if (!slide || count === 0) {
    return null;
  }

  return (
    <section className="relative isolate min-h-[42svh] w-full overflow-hidden bg-[#a5a196] text-white sm:min-h-[50svh] md:aspect-[1871/840] md:min-h-0">
      {slides.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === safeIndex ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== safeIndex}
        >
          <Image
            src={item.imagePath}
            alt={item.imageAlt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-[72%_center] sm:object-[68%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#a5a196]/90 via-[#a5a196]/45 to-transparent md:bg-gradient-to-r md:from-[#a5a196]/70 md:via-[#a5a196]/25 md:to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[42svh] w-full max-w-[1400px] items-center px-4 py-10 sm:min-h-[50svh] sm:px-6 sm:py-12 md:h-full md:min-h-0 md:px-8 md:py-0 lg:px-10">
        <div
          key={slide.id}
          className="max-w-xl animate-[heroFade_0.6s_ease-out] sm:max-w-2xl md:max-w-3xl"
        >
          <p className="mb-2 text-[11px] font-medium tracking-[0.2em] text-[#C9A962] uppercase sm:mb-3 sm:text-xs md:mb-4 md:text-sm">
            {slide.eyebrow}
          </p>
          <h1 className="font-serif text-[1.75rem] leading-[1.1] font-medium text-white sm:text-4xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
            {slide.title}
          </h1>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/85 sm:mt-4 sm:max-w-lg sm:text-base md:mt-6 md:text-lg lg:text-xl">
            {slide.description}
          </p>
          <Link
            href={slide.href}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#C9A962] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D9BC82] sm:mt-6 sm:px-6 sm:py-3 sm:text-base md:mt-10 md:px-7 md:py-3.5 md:text-lg"
          >
            {slide.ctaLabel}
            <ArrowRightIcon className="size-3.5 sm:size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            className="absolute top-1/2 start-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#a5a196]/50 text-white backdrop-blur-sm transition-colors hover:bg-[#a5a196]/75 sm:start-3 sm:size-10 md:start-5 md:size-12"
            aria-label={t("prev")}
          >
            <ChevronLeftIcon className="size-4 sm:size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
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
                onClick={() => goTo(i)}
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
    </section>
  );
}
