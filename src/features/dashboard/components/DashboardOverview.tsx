"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { formatOrderDate, statusLabel, statusTone } from "@/features/dashboard/data";
import { useAdminDashboardOverviewQuery } from "@/store/slices";

const toneClass = {
  gold: "border-[#c4a574]/40 bg-[#17100a] text-white",
  dark: "border-[#2a1f16]/10 bg-[#2a1f16] text-white",
  warn: "border-[#e8c4a8] bg-[#fff6ef] text-[#8a4f2f]",
  cream: "border-[#efe4da] bg-white text-[#2a1f16]",
} as const;

function formatDelta(delta: number) {
  if (delta === 0) return "Same as yesterday";
  if (delta > 0) return `+${delta} vs yesterday`;
  return `${delta} vs yesterday`;
}

export function DashboardOverview() {
  const { data, isLoading, isError } = useAdminDashboardOverviewQuery();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders ?? [];
  const lowStock = data?.lowStock ?? [];

  const cards = [
    {
      id: "orders",
      label: "Orders today",
      value: isLoading ? "…" : String(stats?.ordersToday ?? 0),
      hint: isLoading ? "…" : formatDelta(stats?.ordersDelta ?? 0),
      tone: "gold" as const,
    },
    {
      id: "revenue",
      label: "Revenue today (QAR)",
      value: isLoading
        ? "…"
        : (stats?.revenueToday ?? 0).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          }),
      hint: "Non-cancelled orders",
      tone: "dark" as const,
    },
    {
      id: "stock",
      label: "Low stock",
      value: isLoading ? "…" : String(stats?.lowStockCount ?? 0),
      hint: `Qty ≤ ${stats?.lowStockThreshold ?? 10} or out of stock`,
      tone: "warn" as const,
    },
    {
      id: "subscribers",
      label: "Subscribers",
      value: isLoading ? "…" : String(stats?.subscribers ?? 0),
      hint: isLoading
        ? "…"
        : `${stats?.pendingOrders ?? 0} pending orders · ${stats?.totalOrders ?? 0} total`,
      tone: "cream" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => (
          <article
            key={stat.id}
            className={`rounded-2xl border px-5 py-5 ${toneClass[stat.tone]}`}
          >
            <p
              className={`text-[11px] font-medium tracking-[0.16em] uppercase ${
                stat.tone === "gold" || stat.tone === "dark"
                  ? "text-[#c4a574]"
                  : "text-[#8a7a6c]"
              }`}
            >
              {stat.label}
            </p>
            <p className="mt-3 font-serif text-3xl font-medium tracking-tight">
              {stat.value}
            </p>
            <p
              className={`mt-2 text-xs ${
                stat.tone === "gold" || stat.tone === "dark"
                  ? "text-white/60"
                  : "text-[#8a7a6c]"
              }`}
            >
              {stat.hint}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
          <div className="flex items-center justify-between border-b border-[#efe4da] px-5 py-4">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#2a1f16]">
                Recent orders
              </h2>
              <p className="mt-1 text-xs text-[#8a7a6c]">
                Latest activity across Qatar
              </p>
            </div>
            <Link
              href={ROUTES.dashboardOrders}
              className="text-sm font-medium text-[#c4a574] transition-colors hover:text-[#2a1f16]"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-[#8a7a6c]"
                    >
                      Loading overview…
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-[#a35d5d]"
                    >
                      Could not load dashboard.
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-[#8a7a6c]"
                    >
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
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
                      <td className="px-5 py-4 text-[#5c4f43]">
                        {order.guestName}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium">
                        QAR {(order.total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
          <div className="border-b border-[#efe4da] px-5 py-4">
            <h2 className="font-serif text-xl font-medium text-[#2a1f16]">
              Low stock
            </h2>
            <p className="mt-1 text-xs text-[#8a7a6c]">
              Products at or below {stats?.lowStockThreshold ?? 10} units
            </p>
          </div>
          {isLoading ? (
            <p className="px-5 py-10 text-center text-sm text-[#8a7a6c]">
              Loading stock…
            </p>
          ) : isError ? (
            <p className="px-5 py-10 text-center text-sm text-[#a35d5d]">
              Could not load stock.
            </p>
          ) : lowStock.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-[#8a7a6c]">
              All products are sufficiently stocked.
            </p>
          ) : (
            <ul className="divide-y divide-[#f0e7de]">
              {lowStock.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#FEF9F6]">
                    <Image
                      src={item.imagePath || "/assets/category-coffee-beans.png"}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#2a1f16]">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-[#8a7a6c]">
                      {item.category}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#fff6ef] px-2.5 py-1 text-[11px] font-medium text-[#8a4f2f]">
                    {item.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-[#efe4da] px-5 py-3">
            <Link
              href={ROUTES.dashboardProducts}
              className="text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
            >
              Manage products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
