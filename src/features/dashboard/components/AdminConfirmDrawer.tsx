"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function AdminConfirmDrawer({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        disabled={loading}
        className="absolute inset-0 bg-[#17100a]/50 backdrop-blur-[2px] disabled:cursor-not-allowed"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-2xl border border-[#e8ddd2] bg-white shadow-[0_24px_60px_rgba(23,16,10,0.2)] sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#f0e7de] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#b0895b] uppercase">
              Confirm
            </p>
            <h2
              id="admin-confirm-title"
              className="mt-1 font-serif text-xl font-medium text-[#2a1f16]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#7a6b5d] hover:bg-[#FEF9F6] hover:text-[#2a1f16] disabled:opacity-50"
            aria-label="Close"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="px-5 py-5">
          <p
            id="admin-confirm-description"
            className="text-sm leading-relaxed text-[#7a6b5d]"
          >
            {description}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#e8ddd2] px-4 py-2.5 text-sm font-medium text-[#5c4f43] transition-colors hover:bg-[#FEF9F6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-[#8a4545] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a3030] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Deleting…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
