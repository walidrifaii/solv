"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { slideHref } from "@/lib/slide-href";
import type { ApiPromoBanner } from "@/store/api/types";
import { useGetPromoBannersQuery } from "@/store/slices";

const PER_PAGE = 2;
const AUTO_MS = 4000;

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

function chunkBanners(banners: LocalizedBanner[]) {
  const pages: LocalizedBanner[][] = [];
  for (let i = 0; i < banners.length; i += PER_PAGE) {
    pages.push(banners.slice(i, i + PER_PAGE));
  }
  return pages;
}

export function PromoBanners() {
  const locale = useLocale() as Locale;
  const { data, isLoading, isError } = useGetPromoBannersQuery({ limit: 50 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);

  const banners = useMemo(
    () =>
      (Array.isArray(data) ? data : []).map((item) =>
        localizeBanner(item, locale),
      ),
    [data, locale],
  );
  const pages = useMemo(() => chunkBanners(banners), [banners]);
  const pageCount = pages.length;
  const trackPages = pageCount > 1 ? [...pages, pages[0]] : pages;
  const activeDot = pageCount === 0 ? 0 : index % pageCount;

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const update = () => setViewportWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [banners.length]);

  useEffect(() => {
    setIndex(0);
    setInstant(false);
  }, [banners.length, locale]);

  useEffect(() => {
    if (pageCount <= 1) return;
    const timer = window.setInterval(() => {
      setInstant(false);
      setIndex((current) => current + 1);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [pageCount]);

  if (isLoading || isError || banners.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f5f0e8] px-2 pb-6 sm:px-3 sm:pb-8 md:px-4 md:pb-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <div ref={viewportRef} className="relative overflow-hidden">
          <div
            className={`flex ${instant ? "transition-none" : "transition-transform duration-700 ease-out"}`}
            style={{
              transform:
                viewportWidth > 0
                  ? `translate3d(-${index * viewportWidth}px, 0, 0)`
                  : undefined,
            }}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget) return;
              if (index < pageCount) return;
              setInstant(true);
              setIndex(0);
            }}
          >
            {trackPages.map((group, pageIndex) => (
              <div
                key={`${group.map((item) => item.id).join("-")}-${pageIndex}`}
                className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5"
                style={{
                  width: viewportWidth > 0 ? viewportWidth : "100%",
                }}
              >
                {group.map((banner) => (
                  <Link
                    key={`${banner.id}-${pageIndex}`}
                    href={banner.href}
                    className="group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-[#a5a196] sm:rounded-[1.25rem] md:aspect-[2/1]"
                  >
                    <Image
                      src={banner.imagePath}
                      alt={banner.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {pages.map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeDot
                      ? "w-6 bg-[#C9A962]"
                      : "w-1.5 bg-[#a5a196]/30"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
