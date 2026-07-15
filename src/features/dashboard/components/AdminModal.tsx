"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

export const adminInputClass =
  "w-full rounded-xl border border-[#ddd0c4] bg-white px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574]";

export const adminLabelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#17100a]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[#e8ddd2] bg-white shadow-[0_24px_60px_rgba(23,16,10,0.18)] sm:rounded-2xl ${
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#f0e7de] px-5 py-4">
          <div className="min-w-0">
            <h2
              id="admin-modal-title"
              className="font-serif text-xl font-medium text-[#2a1f16]"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-[#7a6b5d]">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#7a6b5d] hover:bg-[#FEF9F6] hover:text-[#2a1f16]"
            aria-label="Close"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
        active
          ? "bg-[#e8f0e4] text-[#4f6b45]"
          : "bg-[#f6e6e6] text-[#8a4545]"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </span>
  );
}
