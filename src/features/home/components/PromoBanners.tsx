"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { slideHref } from "@/lib/slide-href";
import type { ApiPromoBanner } from "@/store/api/types";
import { useGetPromoBannersQuery } from "@/store/slices";

const PER_PAGE = 2;

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
  const t = useTranslations("home.promoBanners");
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

  if (isLoading || isError || banners.length === 0) {
    return null;
  }

  return (
    <section className="px-2 pb-6 sm:px-3 sm:pb-8 md:px-4 md:pb-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="relative">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5">
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
            <>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => (current - 1 + pageCount) % pageCount)
                }
                className="absolute top-1/2 start-1 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#a5a196]/25 bg-[#FEF9F6]/90 text-[#a5a196] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:start-2 sm:size-10"
                aria-label={t("prev")}
              >
                <ChevronLeftIcon className="size-4 sm:size-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => (current + 1) % pageCount)}
                className="absolute top-1/2 end-1 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#a5a196]/25 bg-[#FEF9F6]/90 text-[#a5a196] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:end-2 sm:size-10"
                aria-label={t("next")}
              >
                <ChevronRightIcon className="size-4 sm:size-5 rtl:rotate-180" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    aria-label={`${i + 1}`}
                    aria-current={i === safePage}
                    className={`h-1.5 rounded-full transition-all ${
                      i === safePage
                        ? "w-6 bg-[#C9A962]"
                        : "w-1.5 bg-[#a5a196]/30 hover:bg-[#a5a196]/50"
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
