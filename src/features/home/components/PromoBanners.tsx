"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
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

export function PromoBanners() {
  const locale = useLocale() as Locale;
  const { data, isLoading, isError } = useGetPromoBannersQuery({ limit: 50 });
  const [page, setPage] = useState(0);

  const banners = useMemo(
    () =>
      (Array.isArray(data) ? data : []).map((item) =>
        localizeBanner(item, locale),
      ),
    [data, locale],
  );

  const pageCount = Math.ceil(banners.length / PER_PAGE);
  const safePage = pageCount === 0 ? 0 : page % pageCount;
  const visible = banners.slice(
    safePage * PER_PAGE,
    safePage * PER_PAGE + PER_PAGE,
  );

  useEffect(() => {
    setPage(0);
  }, [banners.length, locale]);

  useEffect(() => {
    if (pageCount <= 1) return;
    const timer = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [pageCount, safePage]);

  if (isLoading || isError || banners.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f5f0e8] px-2 pb-6 sm:px-3 sm:pb-8 md:px-4 md:pb-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="relative">
          <div
            key={safePage}
            className="grid animate-[heroFade_0.55s_ease-out] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5"
          >
            {visible.map((banner) => (
              <Link
                key={banner.id}
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

          {pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={`h-1.5 rounded-full transition-all ${
                    i === safePage
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
