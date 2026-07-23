"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ROUTES } from "@/constants/routes";
import { productPath } from "@/features/products/utils";
import { useSearch } from "@/features/search/SearchProvider";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { useGetProductsQuery } from "@/store/slices";

const SUGGESTION_KEYS = ["coffee", "tea", "gift", "espresso"] as const;

export function SearchDrawer() {
  const t = useTranslations("search");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const { isOpen, closeSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { data: results = [], isFetching } = useGetProductsQuery(
    { search: debounced, limit: 8 },
    { skip: !isOpen || !debounced },
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setDebounced("");
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeSearch();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeSearch]);

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-start justify-center px-3 pt-3 sm:px-6 sm:pt-[12vh] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[#17100a]/50 transition-opacity duration-250 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label={t("close")}
        onClick={closeSearch}
      />

      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#e8ddd2] bg-[#FEF9F6] text-[#2a1f16] shadow-[0_24px_60px_rgba(23,16,10,0.28)] transition-all duration-250 ease-out sm:rounded-2xl ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
      >
        <div className="flex items-center gap-3 border-b border-[#e8ddd2] px-3 py-3 sm:px-5 sm:py-4">
          <SearchIcon className="size-5 shrink-0 text-[#8a7a6c]" />
          <label htmlFor={inputId} className="sr-only">
            {t("title")}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("placeholder")}
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-[#2a1f16] outline-none placeholder:text-[#a39486] sm:text-[17px]"
            autoComplete="off"
            enterKeyHint="search"
          />
          <kbd className="hidden rounded border border-[#e8ddd2] bg-white px-2 py-1 text-[10px] tracking-wide text-[#8a7a6c] sm:inline">
            ESC
          </kbd>
          <button
            type="button"
            onClick={closeSearch}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[#2a1f16] transition-colors hover:bg-[#F6EDE6]"
            aria-label={t("close")}
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain sm:max-h-[min(60vh,28rem)]">
          {!debounced ? (
            <div className="px-4 py-5 sm:px-6 sm:py-7">
              <p className="text-sm text-[#8a7a6c]">{t("quickSearch")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTION_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setQuery(t(`suggestions.${key}`))}
                    className="rounded-md bg-[#F6EDE6] px-3.5 py-1.5 text-sm text-[#5c4f43] transition-colors hover:bg-[#efe4da]"
                  >
                    {t(`suggestions.${key}`)}
                  </button>
                ))}
              </div>
            </div>
          ) : isFetching ? (
            <div className="px-4 py-8 text-center text-sm text-[#7a6b5d]">
              {t("searching")}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center sm:px-6 sm:py-10">
              <p className="font-serif text-xl text-[#2a1f16]">{t("noResults")}</p>
              <p className="mt-1.5 text-sm text-[#7a6b5d]">
                {t("noResultsFor", { query: debounced })}
              </p>
            </div>
          ) : (
            <ul>
              {results.map((item) => {
                const name = pickLocalized(locale, item.name, item.nameAr);
                const categoryName = item.category
                  ? pickLocalized(
                      locale,
                      item.category.name,
                      item.category.nameAr,
                    )
                  : item.categoryId;
                return (
                  <li key={item.id}>
                    <Link
                      href={productPath(item.slug)}
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-[#F6EDE6] sm:gap-4 sm:px-5 sm:py-3.5"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#E7DDD2] sm:size-16">
                        <Image
                          src={item.imagePath}
                          alt={name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-[#1a120c] sm:text-base">
                          {name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#8a7a6c] sm:text-sm">
                          {categoryName}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-[#c4a574]">
                        {tCommon("currency")} {item.finalPrice.toFixed(2)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {debounced && results.length > 0 ? (
          <div className="border-t border-[#e8ddd2] px-5 py-3.5 text-center">
            <Link
              href={ROUTES.shop}
              onClick={closeSearch}
              className="text-sm font-medium text-[#7a6b5d] transition-colors hover:text-[#2a1f16]"
            >
              {t("viewAll")}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
