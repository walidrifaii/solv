"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGetCountriesQuery } from "@/store/slices";
import type { ApiCountry } from "@/store/api/types";
import { cn } from "@/lib/utils";

type CountryCodeSelectProps = {
  value: string;
  onChange: (country: ApiCountry) => void;
  className?: string;
  selectClassName?: string;
  id?: string;
};

const ITEM_HEIGHT_PX = 40;
const VISIBLE_ITEMS = 5;

export function CountryCodeSelect({
  value,
  onChange,
  className,
  selectClassName,
  id,
}: CountryCodeSelectProps) {
  const t = useTranslations("auth.phone");
  const locale = useLocale();
  const autoId = useId();
  const fieldId = id ?? autoId;
  const listId = `${fieldId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { data: countries = [], isLoading } = useGetCountriesQuery();

  const selected = useMemo(() => {
    return (
      countries.find((c) => c.id === value) ||
      countries.find((c) => c.id === "qa") ||
      countries[0]
    );
  }, [countries, value]);

  const close = useEffectEvent(() => setOpen(false));

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerLabel = selected
    ? `${selected.flagEmoji ? `${selected.flagEmoji} ` : ""}+${selected.dialCode}`
    : "+—";

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <label htmlFor={fieldId} className="sr-only">
        {t("countryCode")}
      </label>
      <button
        id={fieldId}
        type="button"
        disabled={isLoading || countries.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-[3.05rem] w-[5.75rem] cursor-pointer items-center justify-between gap-1 rounded-md border border-[#ddd0c4] bg-white px-2 text-sm text-[#a5a196] outline-none transition-colors hover:border-[#C9A962] focus:border-[#C9A962] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[6.25rem] sm:text-base",
          open && "border-[#C9A962]",
          selectClassName,
        )}
      >
        <span className="truncate font-medium tracking-tight">{triggerLabel}</span>
        <span
          aria-hidden
          className={cn(
            "text-[10px] text-[#8a7a6c] transition-transform",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("countryCode")}
          className="absolute top-full start-0 z-40 mt-1 w-[min(18rem,calc(100vw-2.5rem))] overflow-y-auto overscroll-contain rounded-md border border-[#ddd0c4] bg-white py-1 shadow-[0_8px_24px_rgba(61,46,34,0.12)]"
          style={{ maxHeight: ITEM_HEIGHT_PX * VISIBLE_ITEMS }}
        >
          {countries.map((country) => {
            const label =
              locale === "ar" && country.nameAr ? country.nameAr : country.name;
            const isSelected = country.id === selected?.id;
            return (
              <li key={country.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={cn(
                    "flex h-10 w-full cursor-pointer items-center gap-2 px-3 text-start text-sm text-[#a5a196] transition-colors hover:bg-[#F6EDE6]",
                    isSelected && "bg-[#F6EDE6] font-medium",
                  )}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                >
                  <span className="w-6 shrink-0 text-base leading-none">
                    {country.flagEmoji || ""}
                  </span>
                  <span className="w-12 shrink-0 tabular-nums">
                    +{country.dialCode}
                  </span>
                  <span className="truncate text-[#7a6b5d]">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function useDefaultCountry() {
  const { data: countries = [] } = useGetCountriesQuery();
  return countries.find((c) => c.id === "qa") || countries[0] || null;
}
