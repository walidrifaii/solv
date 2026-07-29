"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { ActiveBadge } from "@/features/dashboard/components/AdminModal";
import { AdminConfirmDrawer } from "@/features/dashboard/components/AdminConfirmDrawer";
import { AdminPagination } from "@/features/dashboard/components/AdminPagination";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import type { ApiAdminHeroSlide } from "@/store/api/types";
import {
  useAdminDeleteSlideMutation,
  useAdminListSlidesQuery,
  useAdminUpdateSlideMutation,
} from "@/store/slices";

type StatusFilter = "all" | "active" | "hidden";

export function DashboardSlidesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [deletingItem, setDeletingItem] = useState<ApiAdminHeroSlide | null>(
    null,
  );
  const [actionError, setActionError] = useState("");

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 10,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(status === "active"
        ? { isActive: true }
        : status === "hidden"
          ? { isActive: false }
          : {}),
    }),
    [page, deferredSearch, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminListSlidesQuery(queryArgs);
  const [updateSlide, { isLoading: updating }] = useAdminUpdateSlideMutation();
  const [deleteSlide, { isLoading: deleting }] = useAdminDeleteSlideMutation();

  const items = data?.items ?? [];
  const meta = data?.meta;

  function askDelete(slide: ApiAdminHeroSlide) {
    setActionError("");
    setDeletingItem(slide);
  }

  async function confirmDelete() {
    if (!deletingItem) return;
    setActionError("");
    try {
      await deleteSlide(deletingItem.id).unwrap();
      setDeletingItem(null);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not delete slide."));
      setDeletingItem(null);
    }
  }

  async function toggleActive(slide: ApiAdminHeroSlide) {
    setActionError("");
    try {
      await updateSlide({
        id: slide.id,
        body: { isActive: !slide.isActive },
      }).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update slide."));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Hero slider
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Manage homepage banner slides (English & Arabic).
          </p>
        </div>
        <Link
          href={ROUTES.dashboardSlideNew}
          className="rounded-xl bg-[#a5a196] px-4 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#b5b1a6]"
        >
          Add slide
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8ddd2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search title or eyebrow…"
            className="w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] focus:border-[#a5a196]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["active", "Active"],
              ["hidden", "Hidden"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setStatus(value);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === value
                  ? "bg-[#2a1f16] text-white"
                  : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {actionError ? (
        <p className="text-sm text-[#a35d5d]" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Slide</th>
                <th className="px-5 py-3 font-medium">Link</th>
                <th className="px-5 py-3 font-medium">Sort</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={isFetching && !isLoading ? "opacity-60" : undefined}
            >
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    Loading slides…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-[#a35d5d]">
                      {getApiErrorMessage(error, "Failed to load slides.")}
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-3 text-sm font-medium text-[#a5a196] hover:text-[#2a1f16]"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    No slides match these filters.
                  </td>
                </tr>
              ) : (
                items.map((slide) => (
                  <tr
                    key={slide.id}
                    className="border-t border-[#f0e7de] hover:bg-[#FEF9F6]/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#FEF9F6]">
                          <Image
                            src={slide.imagePath}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#2a1f16]">
                            {slide.title}
                          </p>
                          <p className="truncate text-xs text-[#8a7a6c]">
                            {slide.eyebrow}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[10rem] truncate px-5 py-4 text-[#5c4f43]">
                      {slide.href}
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      {slide.sortOrder}
                    </td>
                    <td className="px-5 py-4">
                      <ActiveBadge active={slide.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(slide)}
                          disabled={updating || deleting}
                          className="text-xs font-medium text-[#7a6b5d] hover:text-[#2a1f16] disabled:opacity-50"
                        >
                          {slide.isActive ? "Hide" : "Show"}
                        </button>
                        <Link
                          href={ROUTES.dashboardSlideEdit(slide.id)}
                          className="text-xs font-medium text-[#a5a196] hover:text-[#2a1f16]"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => askDelete(slide)}
                          disabled={deleting}
                          className="text-xs font-medium text-[#a35d5d] hover:text-[#7a3030] disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta ? (
          <AdminPagination meta={meta} onPageChange={setPage} />
        ) : null}
      </div>

      <AdminConfirmDrawer
        open={Boolean(deletingItem)}
        title="Delete slide?"
        description={
          deletingItem
            ? `“${deletingItem.title}” will be removed permanently from the homepage slider.`
            : ""
        }
        confirmLabel="Delete slide"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          if (!deleting) setDeletingItem(null);
        }}
      />
    </div>
  );
}
