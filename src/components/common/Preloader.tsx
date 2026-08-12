"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { images } from "@/constants/images";

const PRELOAD_MS = 1600;
const FADE_MS = 400;

export function Preloader({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setFading(true), PRELOAD_MS);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previous;
    }, PRELOAD_MS + FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <>
      {children}
      {visible ? (
        <div
          dir="ltr"
          lang="en"
          className={`preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#a5a196] transition-opacity duration-[400ms] ease-out ${
            fading ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-busy="true"
          aria-live="polite"
          role="status"
        >
          <div className="preloader-logo" aria-label="SOLV">
            <Image
              src={images.logoBlack}
              alt="SOLV"
              className="preloader-logo-img h-auto w-[min(16rem,55vw)] object-contain sm:w-[min(20rem,50vw)]"
              priority
            />
          </div>

          <div className="preloader-rule" aria-hidden />

          <p className="preloader-tagline mt-5 text-[10px] tracking-[0.32em] text-white/45 uppercase sm:text-[11px]">
            Coffee &amp; Tea Supplier
          </p>
        </div>
      ) : null}
    </>
  );
}
