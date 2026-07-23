"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { useLocaleSwitch } from "@/components/providers/LocaleSwitchProvider";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_META: Record<
  Locale,
  { shortKey: "enShort" | "arShort"; fullKey: "en" | "ar" }
> = {
  en: { shortKey: "enShort", fullKey: "en" },
  ar: { shortKey: "arShort", fullKey: "ar" },
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("locale");
  const { switching, switchLocale } = useLocaleSwitch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function selectLocale(next: Locale) {
    if (next === locale || switching) {
      setOpen(false);
      return;
    }

    setOpen(false);
    await switchLocale(next);
  }

  const current = LOCALE_META[locale];

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        disabled={switching}
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (!switching) setOpen((value) => !value);
        }}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/15 bg-[#17100a]/60 px-2.5 text-xs font-medium tracking-wide text-[#d1d1d1] transition-colors hover:border-[#c4a574]/50 hover:text-white disabled:cursor-wait disabled:opacity-60 sm:h-9 sm:px-3 sm:text-sm"
      >
        <span className="min-w-[1.75rem] text-center">{t(current.shortKey)}</span>
        <ChevronDownIcon
          className={`size-3.5 shrink-0 text-[#c4a574] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("label")}
          className="absolute top-full end-0 z-[60] mt-2 min-w-[9.5rem] overflow-hidden rounded-md border border-white/10 bg-[#17100a] py-1 shadow-xl"
        >
          {locales.map((code) => {
            const meta = LOCALE_META[code];
            const selected = code === locale;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  disabled={switching}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void selectLocale(code);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start text-sm transition-colors ${
                    selected
                      ? "bg-white/5 text-[#c4a574]"
                      : "text-[#d1d1d1] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{t(meta.fullKey)}</span>
                  <span className="text-[11px] tracking-wide text-white/40 uppercase">
                    {t(meta.shortKey)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
