"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { ActiveBadge } from "@/features/dashboard/components/AdminModal";
import { AdminConfirmDrawer } from "@/features/dashboard/components/AdminConfirmDrawer";
import { AdminPagination } from "@/features/dashboard/components/AdminPagination";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import type { ApiAdminPromoBanner } from "@/store/api/types";
import {
  useAdminDeletePromoBannerMutation,
  useAdminListPromoBannersQuery,
  useAdminUpdatePromoBannerMutation,
} from "@/store/slices";

type StatusFilter = "all" | "active" | "hidden";

export function DashboardBannersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [deletingItem, setDeletingItem] = useState<ApiAdminPromoBanner | null>(
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
    useAdminListPromoBannersQuery(queryArgs);
  const [updateBanner, { isLoading: updating }] =
    useAdminUpdatePromoBannerMutation();
  const [deleteBanner, { isLoading: deleting }] =
    useAdminDeletePromoBannerMutation();

  const items = data?.items ?? [];
  const meta = data?.meta;

  function askDelete(banner: ApiAdminPromoBanner) {
    setActionError("");
    setDeletingItem(banner);
  }

  async function confirmDelete() {
    if (!deletingItem) return;
    setActionError("");
    try {
      await deleteBanner(deletingItem.id).unwrap();
      setDeletingItem(null);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not delete banner."));
      setDeletingItem(null);
    }
  }

  async function toggleActive(banner: ApiAdminPromoBanner) {
    setActionError("");
    try {
      await updateBanner({
        id: banner.id,
        body: { isActive: !banner.isActive },
      }).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update banner."));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#a5a196]">
            Promo banners
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Two-up homepage banners shown before Shop by Category.
          </p>
        </div>
        <Link
          href={ROUTES.dashboardBannerNew}
          className="rounded-xl bg-[#C9A962] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D9BC82]"
        >
          Add banner
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
            placeholder="Search alt or category…"
            className="w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#a5a196] outline-none placeholder:text-[#a39486] focus:border-[#C9A962]"
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
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                status === value
                  ? "bg-[#C9A962] text-white"
                  : "bg-[#FEF9F6] text-[#7a6b5d] hover:bg-[#f3ebe3]"
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
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-[#FEF9F6] text-xs tracking-wide text-[#8a7a6c] uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Banner</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    Loading banners…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-sm text-[#a35d5d]">
                      {getApiErrorMessage(error, "Failed to load banners.")}
                    </p>
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="mt-3 text-sm font-medium text-[#C9A962] hover:text-[#a5a196]"
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
                    No banners match these filters.
                  </td>
                </tr>
              ) : (
                items.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-t border-[#f0e7de] hover:bg-[#FEF9F6]/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#FEF9F6]">
                          <Image
                            src={banner.imagePath}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <p className="min-w-0 truncate font-medium text-[#a5a196]">
                          {banner.imageAlt}
                        </p>
                      </div>
                    </td>
                    <td className="max-w-[12rem] truncate px-5 py-4 text-[#5c4f43]">
                      {banner.categoryId ?? banner.href}
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      {banner.sortOrder}
                    </td>
                    <td className="px-5 py-4">
                      <ActiveBadge active={banner.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(banner)}
                          disabled={updating || deleting}
                          className="text-xs font-medium text-[#7a6b5d] hover:text-[#a5a196] disabled:opacity-50"
                        >
                          {banner.isActive ? "Hide" : "Show"}
                        </button>
                        <Link
                          href={ROUTES.dashboardBannerEdit(banner.id)}
                          className="text-xs font-medium text-[#C9A962] hover:text-[#a5a196]"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => askDelete(banner)}
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
        title="Delete banner?"
        description={
          deletingItem
            ? `“${deletingItem.imageAlt}” will be removed permanently from the homepage.`
            : ""
        }
        confirmLabel="Delete banner"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          if (!deleting) setDeletingItem(null);
        }}
      />
    </div>
  );
}
