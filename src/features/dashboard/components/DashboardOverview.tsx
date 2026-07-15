"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  dashboardMock,
  formatOrderDate,
  statusLabel,
  statusTone,
} from "@/features/dashboard/data";
import { useAdminListOrdersQuery } from "@/store/slices";

const toneClass = {
  gold: "border-[#c4a574]/40 bg-[#17100a] text-white",
  dark: "border-[#2a1f16]/10 bg-[#2a1f16] text-white",
  warn: "border-[#e8c4a8] bg-[#fff6ef] text-[#8a4f2f]",
  cream: "border-[#efe4da] bg-white text-[#2a1f16]",
} as const;

export function DashboardOverview() {
  const { data, isLoading, isError } = useAdminListOrdersQuery({
    page: 1,
    limit: 5,
  });
  const recentOrders = data?.items ?? [];
  const pendingCount =
    data?.items.filter((order) => order.status === "PENDING").length ?? 0;

  const stats = [
    {
      id: "orders",
      label: "Recent orders",
      value: isLoading ? "…" : String(data?.meta.total ?? 0),
      hint: "Total in store",
      tone: "gold" as const,
    },
    {
      id: "pending",
      label: "Pending (page)",
      value: isLoading ? "…" : String(pendingCount),
      hint: "In latest five",
      tone: "dark" as const,
    },
    dashboardMock.stats[2],
    dashboardMock.stats[3],
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
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
                      Loading orders…
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-[#a35d5d]"
                    >
                      Could not load orders.
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
              Preview — live stock API later
            </p>
          </div>
          <ul className="divide-y divide-[#f0e7de]">
            {dashboardMock.lowStock.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="font-medium text-[#2a1f16]">{item.name}</p>
                  <p className="text-xs text-[#8a7a6c]">{item.category}</p>
                </div>
                <span className="rounded-full bg-[#fff6ef] px-2.5 py-1 text-[11px] font-medium text-[#8a4f2f]">
                  {item.qty} left
                </span>
              </li>
            ))}
          </ul>
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
