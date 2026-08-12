"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { images } from "@/constants/images";
import { getDirection, type Locale } from "@/i18n/config";
import { setLocale as setLocaleAction } from "@/i18n/locale";

const SWITCH_MS = 900;
const FADE_MS = 350;

type LocaleSwitchContextValue = {
  switching: boolean;
  switchLocale: (next: Locale) => Promise<void>;
};

const LocaleSwitchContext = createContext<LocaleSwitchContextValue | null>(
  null,
);

export function useLocaleSwitch() {
  const ctx = useContext(LocaleSwitchContext);
  if (!ctx) {
    throw new Error("useLocaleSwitch must be used within LocaleSwitchProvider");
  }
  return ctx;
}

function applyDocumentLocale(locale: Locale) {
  const root = document.documentElement;
  const dir = getDirection(locale);
  root.lang = locale;
  root.dir = dir;
  root.classList.toggle("font-ar", locale === "ar");
}

export function LocaleSwitchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const switchLocale = useCallback(
    async (next: Locale) => {
      if (switching) return;

      setSwitching(true);
      setFading(false);
      setAnimKey((key) => key + 1);
      setVisible(true);

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const started = Date.now();

      try {
        applyDocumentLocale(next);
        await setLocaleAction(next);
        router.refresh();
      } catch {
        setVisible(false);
        setSwitching(false);
        document.body.style.overflow = previousOverflow;
        return;
      }

      const elapsed = Date.now() - started;
      const wait = Math.max(0, SWITCH_MS - elapsed);
      await new Promise((resolve) => window.setTimeout(resolve, wait));

      setFading(true);
      await new Promise((resolve) => window.setTimeout(resolve, FADE_MS));

      setVisible(false);
      setFading(false);
      document.body.style.overflow = previousOverflow;
      setSwitching(false);
    },
    [router, switching],
  );

  const value = useMemo(
    () => ({ switching, switchLocale }),
    [switching, switchLocale],
  );

  return (
    <LocaleSwitchContext.Provider value={value}>
      {children}
      {visible ? (
        <div
          key={animKey}
          dir="ltr"
          lang="en"
          className={`preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#a5a196] transition-opacity duration-[350ms] ease-out ${
            fading ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-busy="true"
          aria-live="polite"
          role="status"
        >
          <div className="preloader-logo preloader-logo--switch" aria-label="SOLV">
            <Image
              src={images.logoBlack}
              alt="SOLV"
              className="preloader-logo-img h-auto w-[min(12rem,48vw)] object-contain sm:w-[min(16rem,42vw)]"
              priority
            />
          </div>
          <div className="preloader-rule preloader-rule--switch" aria-hidden />
          <p className="preloader-tagline preloader-tagline--switch mt-5 text-[10px] tracking-[0.32em] text-white/45 uppercase sm:text-[11px]">
            Coffee &amp; Tea Supplier
          </p>
        </div>
      ) : null}
    </LocaleSwitchContext.Provider>
  );
}
