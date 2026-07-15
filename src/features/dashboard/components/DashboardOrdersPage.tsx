"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AdminPagination } from "@/features/dashboard/components/AdminPagination";
import { OrderDetailDrawer } from "@/features/dashboard/components/OrderDetailDrawer";
import {
  ORDER_STATUS_FILTERS,
  formatOrderDate,
  statusLabel,
  statusTone,
} from "@/features/dashboard/data";
import { getApiErrorMessage } from "@/store/api/errors";
import type { OrderStatus } from "@/store/api/types";
import { useAdminListOrdersQuery } from "@/store/slices";

type StatusFilter = "all" | OrderStatus;

export function DashboardOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 10,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(status !== "all" ? { status } : {}),
    }),
    [page, deferredSearch, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminListOrdersQuery(queryArgs);

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Orders
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Track fulfillment across Qatar. Open an order to update its status.
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#e8ddd2] bg-white p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search order #, name, email, phone, city…"
          className="w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] focus:border-[#c4a574] lg:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setStatus(filter.value as StatusFilter);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === filter.value
                  ? "bg-[#2a1f16] text-white"
                  : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium text-right"> </th>
              </tr>
            </thead>
            <tbody
              className={isFetching && !isLoading ? "opacity-60" : undefined}
            >
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    Loading orders…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-[#a35d5d]">
                      {getApiErrorMessage(error, "Failed to load orders.")}
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-3 text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    No orders match these filters.
                  </td>
                </tr>
              ) : (
                items.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#f0e7de] hover:bg-[#FEF9F6]/80"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#2a1f16]">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-[#8a7a6c]">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[#5c4f43]">{order.guestName}</p>
                      <p className="text-xs text-[#8a7a6c]">
                        {order.guestPhone}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      {order.deliveryCity}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#2a1f16]">
                      QAR {(order.total ?? 0).toFixed(2)}
                      <p className="text-xs font-normal text-[#8a7a6c]">
                        {order.itemCount} item
                        {order.itemCount === 1 ? "" : "s"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(order.id)}
                        className="text-xs font-medium text-[#c4a574] hover:text-[#2a1f16]"
                      >
                        Details
                      </button>
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

      <OrderDetailDrawer
        open={Boolean(selectedId)}
        orderId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
