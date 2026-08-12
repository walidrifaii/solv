"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
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

export function CountryCodeSelect({
  value,
  onChange,
  className,
  selectClassName,
  id = "country-code",
}: CountryCodeSelectProps) {
  const t = useTranslations("auth.phone");
  const locale = useLocale();
  const { data: countries = [], isLoading } = useGetCountriesQuery();

  const selected = useMemo(() => {
    return (
      countries.find((c) => c.id === value) ||
      countries.find((c) => c.id === "qa") ||
      countries[0]
    );
  }, [countries, value]);

  return (
    <div className={cn("shrink-0", className)}>
      <label htmlFor={id} className="sr-only">
        {t("countryCode")}
      </label>
      <select
        id={id}
        value={selected?.id ?? ""}
        disabled={isLoading || countries.length === 0}
        onChange={(event) => {
          const country = countries.find((c) => c.id === event.target.value);
          if (country) onChange(country);
        }}
        className={cn(
          "h-full min-w-[7.5rem] cursor-pointer rounded-md border border-[#ddd0c4] bg-white px-2 py-3 text-sm text-[#a5a196] outline-none transition-colors focus:border-[#C9A962] disabled:opacity-60 sm:min-w-[8.5rem] sm:text-base",
          selectClassName,
        )}
      >
        {countries.map((country) => {
          const label =
            locale === "ar" && country.nameAr ? country.nameAr : country.name;
          return (
            <option key={country.id} value={country.id}>
              {country.flagEmoji ? `${country.flagEmoji} ` : ""}+
              {country.dialCode} {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function useDefaultCountry() {
  const { data: countries = [] } = useGetCountriesQuery();
  return (
    countries.find((c) => c.id === "qa") ||
    countries[0] ||
    null
  );
}
