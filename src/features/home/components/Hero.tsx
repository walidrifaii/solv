"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { heroSlides } from "@/features/home/data";

const AUTO_MS = 6500;

export function Hero() {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [index]);

  function goTo(next: number) {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }

  return (
    <section className="relative isolate min-h-[70svh] w-full overflow-hidden bg-[#17100a] text-white sm:min-h-[75svh] md:aspect-[1871/840] md:min-h-0">
      {heroSlides.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-[72%_center] sm:object-[68%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17100a]/90 via-[#17100a]/45 to-transparent md:bg-gradient-to-r md:from-[#17100a]/70 md:via-[#17100a]/25 md:to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-[1400px] items-start px-4 pb-16 pt-8 sm:min-h-[75svh] sm:items-center sm:px-6 sm:pb-20 sm:pt-10 md:h-full md:min-h-0 md:items-center md:px-8 md:pb-0 lg:px-10">
        <div
          key={slide.id}
          className="max-w-xl animate-[heroFade_0.6s_ease-out] sm:max-w-2xl md:max-w-3xl"
        >
          <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-[#c4a574] uppercase sm:mb-4 sm:text-xs md:text-sm">
            {slide.eyebrow}
          </p>
          <h1 className="font-serif text-[2rem] leading-[1.1] font-medium text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:mt-5 sm:max-w-lg sm:text-base md:mt-6 md:text-lg lg:text-xl">
            {slide.description}
          </p>
          <Link
            href={slide.cta.href}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#c4a574] px-5 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] sm:mt-8 sm:px-6 sm:py-3 sm:text-base md:mt-10 md:px-7 md:py-3.5 md:text-lg"
          >
            {slide.cta.label}
            <ArrowRightIcon className="size-3.5 sm:size-4" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        className="absolute top-1/2 left-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#17100a]/50 text-white backdrop-blur-sm transition-colors hover:bg-[#17100a]/75 sm:left-3 sm:size-10 md:left-5 md:size-12"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="size-4 sm:size-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        className="absolute top-1/2 right-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#17100a]/50 text-white backdrop-blur-sm transition-colors hover:bg-[#17100a]/75 sm:right-3 sm:size-10 md:right-5 md:size-12"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="size-4 sm:size-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-5 md:bottom-6 md:gap-2.5">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all sm:h-2 ${
              i === index
                ? "w-6 bg-white sm:w-8"
                : "w-1.5 bg-white/35 hover:bg-white/60 sm:w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
