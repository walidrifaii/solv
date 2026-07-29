"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

type CheckoutAuthModalProps = {
  open: boolean;
  onGuest: () => void;
  onClose: () => void;
  loginHref: string;
  registerHref: string;
};

export function CheckoutAuthModal({
  open,
  onGuest,
  onClose,
  loginHref,
  registerHref,
}: CheckoutAuthModalProps) {
  const t = useTranslations("checkout.authChoice");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#a5a196]/55 backdrop-blur-[2px]"
        aria-label={t("close")}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-auth-title"
        className="relative z-10 w-full max-w-md animate-[heroFade_0.35s_ease-out] rounded-2xl border border-[#e8ddd2] bg-[#FEF9F6] p-6 shadow-[0_24px_60px_rgba(23,16,10,0.22)] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-[#a5a196] transition-colors hover:bg-[#F6EDE6]"
          aria-label={t("close")}
        >
          <CloseIcon className="size-5" />
        </button>

        <p className="text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase">
          {t("eyebrow")}
        </p>
        <h2
          id="checkout-auth-title"
          className="mt-2 pe-8 font-serif text-2xl font-medium text-[#a5a196] sm:text-3xl"
        >
          {t("title")}
        </h2>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onGuest}
            className="w-full cursor-pointer rounded-md border border-[#C9A962] bg-[#C9A962] px-4 py-4 text-start transition-colors hover:bg-[#D9BC82]"
          >
            <p className="text-sm font-medium text-[#a5a196]">{t("guest.label")}</p>
            <p className="mt-1 text-sm text-[#a5a196]/75">{t("guest.description")}</p>
          </button>

          <Link
            href={loginHref}
            className="block w-full cursor-pointer rounded-md border border-[#ddd0c4] bg-white px-4 py-4 text-start transition-colors hover:border-[#C9A962]"
          >
            <p className="text-sm font-medium text-[#a5a196]">{t("login.label")}</p>
            <p className="mt-1 text-sm text-[#7a6b5d]">{t("login.description")}</p>
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-[#7a6b5d]">
          {t("registerPrompt")}{" "}
          <Link
            href={registerHref}
            className="font-medium text-[#a5a196] underline-offset-2 hover:text-[#C9A962] hover:underline"
          >
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
