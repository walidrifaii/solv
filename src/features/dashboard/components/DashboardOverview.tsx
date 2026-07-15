import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  dashboardMock,
  statusLabel,
  statusTone,
} from "@/features/dashboard/data";

const toneClass = {
  gold: "border-[#c4a574]/40 bg-[#17100a] text-white",
  dark: "border-[#2a1f16]/10 bg-[#2a1f16] text-white",
  warn: "border-[#e8c4a8] bg-[#fff6ef] text-[#8a4f2f]",
  cream: "border-[#efe4da] bg-white text-[#2a1f16]",
} as const;

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMock.stats.map((stat) => (
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
                {dashboardMock.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#f0e7de] transition-colors hover:bg-[#FEF9F6]/80"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#2a1f16]">
                        {order.orderNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8a7a6c]">
                        {order.createdAt} · {order.city}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-[#5c4f43]">
                      {order.guest}
                      <span className="mt-0.5 block text-xs text-[#8a7a6c]">
                        {order.items} items
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#2a1f16]">
                      QAR {order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e8ddd2] bg-white px-5 py-5">
            <h2 className="font-serif text-xl font-medium text-[#2a1f16]">
              Low stock
            </h2>
            <ul className="mt-4 space-y-3">
              {dashboardMock.lowStock.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#FEF9F6] px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#2a1f16]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#8a7a6c]">{item.category}</p>
                  </div>
                  <span className="rounded-full bg-[#fff6ef] px-2.5 py-1 text-xs font-medium text-[#8a4f2f]">
                    {item.qty} left
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e8ddd2] bg-[#17100a] px-5 py-5 text-white">
            <p className="text-[11px] font-medium tracking-[0.16em] text-[#c4a574] uppercase">
              Quick actions
            </p>
            <div className="mt-4 grid gap-2">
              <Link
                href={ROUTES.dashboardOrders}
                className="rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
              >
                Review pending orders
              </Link>
              <Link
                href={ROUTES.dashboardProducts}
                className="rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
              >
                Check product stock
              </Link>
              <Link
                href={ROUTES.dashboardSubscribers}
                className="rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
              >
                Newsletter subscribers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
