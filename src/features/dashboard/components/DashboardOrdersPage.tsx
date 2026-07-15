import Link from "next/link";
import {
  dashboardMock,
  statusLabel,
  statusTone,
} from "@/features/dashboard/data";

export function DashboardOrdersPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Orders
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Monitor fulfillment status. Actions will connect to admin APIs later.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Preparing", "Delivered"].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === "All"
                  ? "bg-[#2a1f16] text-white"
                  : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {dashboardMock.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[#f0e7de] hover:bg-[#FEF9F6]/80"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#2a1f16]">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-[#8a7a6c]">{order.createdAt}</p>
                  </td>
                  <td className="px-5 py-4 text-[#5c4f43]">{order.guest}</td>
                  <td className="px-5 py-4 text-[#5c4f43]">{order.city}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium">
                    QAR {order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="text-xs font-medium text-[#c4a574] hover:text-[#2a1f16]"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#8a7a6c]">
        Tip: status changes will require an admin-protected API (not public
        shop endpoints).{" "}
        <Link href="/api/docs" className="text-[#c4a574] underline">
          API docs
        </Link>
      </p>
    </div>
  );
}
