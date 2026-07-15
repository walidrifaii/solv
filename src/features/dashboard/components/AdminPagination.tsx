"use client";

import type { PaginationMeta } from "@/store/api/types";

export function AdminPagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.total === 0) return null;

  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e7de] bg-white px-5 py-3.5">
      <p className="text-xs text-[#8a7a6c]">
        Showing{" "}
        <span className="font-medium text-[#5c4f43]">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-[#5c4f43]">{meta.total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!meta.hasPrev}
          onClick={() => onPageChange(meta.page - 1)}
          className="rounded-lg border border-[#e8ddd2] bg-white px-3 py-1.5 text-xs font-medium text-[#5c4f43] transition-colors hover:border-[#c4a574] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="min-w-[4.5rem] text-center text-xs text-[#7a6b5d]">
          Page {meta.page} / {meta.totalPages}
        </span>
        <button
          type="button"
          disabled={!meta.hasNext}
          onClick={() => onPageChange(meta.page + 1)}
          className="rounded-lg border border-[#e8ddd2] bg-white px-3 py-1.5 text-xs font-medium text-[#5c4f43] transition-colors hover:border-[#c4a574] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
