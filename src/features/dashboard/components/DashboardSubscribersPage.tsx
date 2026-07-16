"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AdminPagination } from "@/features/dashboard/components/AdminPagination";
import { getApiErrorMessage } from "@/store/api/errors";
import { useAdminListSubscribersQuery } from "@/store/slices";

function formatJoined(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function DashboardSubscribersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [activeOnly, setActiveOnly] = useState(true);

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 10,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(activeOnly ? { isActive: true } : {}),
    }),
    [page, deferredSearch, activeOnly],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminListSubscribersQuery(queryArgs);

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Subscribers
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Newsletter signups from the home page community section.
          </p>
        </div>
        {meta ? (
          <p className="text-sm text-[#8a7a6c]">
            {meta.total} total
            {isFetching ? " · Updating…" : ""}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-2xl border border-[#e8ddd2] bg-white p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by email…"
          className="w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] focus:border-[#c4a574] lg:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveOnly(true);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeOnly
                ? "bg-[#2a1f16] text-white"
                : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveOnly(false);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              !activeOnly
                ? "bg-[#2a1f16] text-white"
                : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
            }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        {isLoading ? (
          <p className="px-5 py-12 text-center text-sm text-[#8a7a6c]">
            Loading subscribers…
          </p>
        ) : isError ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[#a35d5d]">
              {getApiErrorMessage(error, "Failed to load subscribers.")}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[#8a7a6c]">
            No subscribers yet.
          </p>
        ) : (
          <ul className="divide-y divide-[#f0e7de]">
            {items.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-[#2a1f16]">{row.email}</p>
                  <p className="text-xs text-[#8a7a6c]">
                    Joined {formatJoined(row.subscribedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    row.isActive
                      ? "bg-[#e8f0e4] text-[#4f6b45]"
                      : "bg-[#f6e6e6] text-[#8a4545]"
                  }`}
                >
                  {row.isActive ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
          </ul>
        )}

        {meta && meta.totalPages > 1 ? (
          <div className="border-t border-[#efe4da] px-5 py-3">
            <AdminPagination meta={meta} onPageChange={setPage} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
