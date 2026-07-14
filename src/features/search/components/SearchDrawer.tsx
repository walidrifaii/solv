"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ROUTES } from "@/constants/routes";
import { getProductBySlug, productPath } from "@/features/products/data/catalog";
import { useSearch } from "@/features/search/SearchProvider";
import { searchLocalProducts } from "@/features/search/searchProducts";

export function SearchDrawer() {
  const { isOpen, closeSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchLocalProducts(query, 8), [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
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
        aria-label="Close search"
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
        aria-label="Search products"
      >
        <div className="flex items-center gap-3 border-b border-[#e8ddd2] px-3 py-3 sm:px-5 sm:py-4">
          <SearchIcon className="size-5 shrink-0 text-[#8a7a6c]" />
          <label htmlFor={inputId} className="sr-only">
            Search products
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search coffee, tea, gifts..."
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
            aria-label="Close search"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain sm:max-h-[min(60vh,28rem)]">
          {!query.trim() ? (
            <div className="px-4 py-5 sm:px-6 sm:py-7">
              <p className="text-sm text-[#8a7a6c]">Quick search</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Coffee", "Tea", "Gift", "Espresso"].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-md bg-[#F6EDE6] px-3.5 py-1.5 text-sm text-[#5c4f43] transition-colors hover:bg-[#efe4da]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center sm:px-6 sm:py-10">
              <p className="font-serif text-xl text-[#2a1f16]">No matches</p>
              <p className="mt-1.5 text-sm text-[#7a6b5d]">
                Nothing for &quot;{query.trim()}&quot;
              </p>
            </div>
          ) : (
            <ul>
              {results.map((item) => {
                const catalogProduct = getProductBySlug(item.slug);
                return (
                  <li key={item.id}>
                    <Link
                      href={productPath(item.slug)}
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-[#F6EDE6] sm:gap-4 sm:px-5 sm:py-3.5"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#E7DDD2] sm:size-16">
                        {catalogProduct ? (
                          <Image
                            src={catalogProduct.image}
                            alt={catalogProduct.imageAlt}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-[#1a120c] sm:text-base">
                          {item.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#8a7a6c] sm:text-sm">
                          <span className="sm:hidden">{item.categoryLabel}</span>
                          <span className="hidden sm:inline">
                            {item.categoryLabel} · {item.subtitle}
                          </span>
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-[#c4a574]">
                        {item.currency} {item.price.toFixed(2)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {query.trim() && results.length > 0 ? (
          <div className="border-t border-[#e8ddd2] px-5 py-3.5 text-center">
            <Link
              href={ROUTES.shop}
              onClick={closeSearch}
              className="text-sm font-medium text-[#7a6b5d] transition-colors hover:text-[#2a1f16]"
            >
              View all in shop
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
