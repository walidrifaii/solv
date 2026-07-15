"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AdminModal,
  adminInputClass,
  adminLabelClass,
} from "@/features/dashboard/components/AdminModal";
import {
  ORDER_STATUSES,
  formatOrderDate,
  statusLabel,
  statusTone,
} from "@/features/dashboard/data";
import { getApiErrorMessage } from "@/store/api/errors";
import type { OrderStatus } from "@/store/api/types";
import {
  useAdminGetOrderQuery,
  useAdminUpdateOrderStatusMutation,
} from "@/store/slices";

type Props = {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
};

export function OrderDetailDrawer({ orderId, open, onClose }: Props) {
  const { data: order, isLoading, isError, error, refetch } =
    useAdminGetOrderQuery(orderId ?? "", {
      skip: !open || !orderId,
    });
  const [updateStatus, { isLoading: saving }] =
    useAdminUpdateOrderStatusMutation();
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [actionError, setActionError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setActionError("");
      setSavedFlash(false);
    }
  }, [order]);

  async function handleSaveStatus() {
    if (!orderId || !order) return;
    if (status === order.status) return;
    setActionError("");
    setSavedFlash(false);
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      setSavedFlash(true);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update status."));
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      wide
      title={order ? order.orderNumber : "Order details"}
      description={
        order
          ? `Placed ${formatOrderDate(order.createdAt)}`
          : "Review customer details and update fulfillment status."
      }
    >
      {isLoading ? (
        <p className="py-8 text-center text-sm text-[#8a7a6c]">
          Loading order…
        </p>
      ) : isError || !order ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[#a35d5d]">
            {getApiErrorMessage(error, "Order not found.")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
            >
              {statusLabel(order.status)}
            </span>
            <span className="text-xs text-[#8a7a6c]">
              {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-xl border border-[#efe4da] bg-[#FEF9F6] px-4 py-4">
              <h3 className="text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase">
                Customer
              </h3>
              <p className="mt-2 font-medium text-[#2a1f16]">{order.guestName}</p>
              <p className="mt-1 text-sm text-[#5c4f43]">{order.guestEmail}</p>
              <p className="mt-0.5 text-sm text-[#5c4f43]">{order.guestPhone}</p>
            </section>
            <section className="rounded-xl border border-[#efe4da] bg-[#FEF9F6] px-4 py-4">
              <h3 className="text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase">
                Delivery
              </h3>
              <p className="mt-2 font-medium text-[#2a1f16]">
                {order.deliveryCity}
              </p>
              <p className="mt-1 text-sm text-[#5c4f43]">
                {order.deliveryAddress}
              </p>
              {order.notes ? (
                <p className="mt-2 text-sm text-[#7a6b5d]">
                  Note: {order.notes}
                </p>
              ) : null}
            </section>
          </div>

          <section>
            <h3 className="mb-3 text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase">
              Items
            </h3>
            <div className="overflow-hidden rounded-xl border border-[#e8ddd2]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.1em] text-[#8a7a6c] uppercase">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Product</th>
                    <th className="px-4 py-2.5 font-medium">Qty</th>
                    <th className="px-4 py-2.5 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#f0e7de]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#FEF9F6]">
                            {item.imagePath ? (
                              <Image
                                src={item.imagePath}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-[10px] text-[#a39486]">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#2a1f16]">
                              {item.productName}
                            </p>
                            <p className="truncate text-xs text-[#8a7a6c]">
                              {item.productId ?? "Product removed"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#5c4f43]">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-[#2a1f16]">
                        QAR {(item.total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-[#5c4f43]">
                <span>Subtotal</span>
                <span>QAR {(order.subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5c4f43]">
                <span>Delivery</span>
                <span>QAR {(order.deliveryFee ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-[#efe4da] pt-2 font-medium text-[#2a1f16]">
                <span>Total</span>
                <span>QAR {(order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e8ddd2] bg-white px-4 py-4">
            <label className={adminLabelClass} htmlFor="order-status">
              Fulfillment status
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                id="order-status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as OrderStatus);
                  setSavedFlash(false);
                }}
                className={adminInputClass + " sm:max-w-xs"}
              >
                {ORDER_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {statusLabel(value)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={saving || status === order.status}
                onClick={() => void handleSaveStatus()}
                className="rounded-xl bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Update status"}
              </button>
            </div>
            {status === "CANCELLED" && order.status !== "CANCELLED" ? (
              <p className="mt-2 text-xs text-[#8a4545]">
                Cancelling restores stock for products still linked to this
                order.
              </p>
            ) : null}
            {savedFlash ? (
              <p className="mt-2 text-sm text-[#4f6b45]">Status updated.</p>
            ) : null}
            {actionError ? (
              <p className="mt-2 text-sm text-[#a35d5d]" role="alert">
                {actionError}
              </p>
            ) : null}
          </section>
        </div>
      )}
    </AdminModal>
  );
}
