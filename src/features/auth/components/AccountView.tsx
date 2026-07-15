"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { statusLabel, statusTone } from "@/features/dashboard/data";
import {
  useGetMeQuery,
  useGetMyOrdersQuery,
  useLogoutMutation,
} from "@/store/slices";

export function AccountView() {
  const router = useRouter();
  const { data: client, isLoading, isError } = useGetMeQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetMyOrdersQuery(
    undefined,
    { skip: !client },
  );
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
        Loading account…
      </div>
    );
  }

  if (isError || !client) {
    router.replace(ROUTES.login);
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
        Redirecting to login…
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    router.push(ROUTES.login);
    router.refresh();
  }

  return (
    <main className="flex flex-1 flex-col bg-[#FEF9F6] text-[#2a1f16]">
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16 md:px-8">
        <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase">
          Account
        </p>
        <h1 className="font-serif text-3xl font-medium sm:text-4xl">
          Hello, {client.name}
        </h1>
        <p className="mt-2 text-sm text-[#7a6b5d]">{client.email}</p>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-6 rounded-md border border-[#ddd0c4] px-4 py-2 text-sm text-[#2a1f16] transition-colors hover:border-[#c4a574] disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>

        <div className="mt-12">
          <h2 className="font-serif text-2xl font-medium">Your orders</h2>
          {ordersLoading ? (
            <p className="mt-4 text-sm text-[#7a6b5d]">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="mt-4 text-sm text-[#7a6b5d]">
              No orders yet.{" "}
              <Link href={ROUTES.shop} className="text-[#c4a574] underline">
                Browse the shop
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-xl border border-[#efe4da] bg-white px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-[#2a1f16]">
                      {order.orderNumber}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#7a6b5d]">
                    {order.itemCount} item{order.itemCount === 1 ? "" : "s"} · QAR{" "}
                    {(order.total ?? 0).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
