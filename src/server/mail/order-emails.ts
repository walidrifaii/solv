import {
  getOrderNotifyAdminEmail,
  queueMail,
} from "@/server/mail/mailer";

type OrderItemEmail = {
  productName: string;
  quantity: number;
  total: number | null;
};

type OrderEmailPayload = {
  orderNumber: string;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes: string | null;
  subtotal: number | null;
  deliveryFee: number | null;
  total: number | null;
  items: OrderItemEmail[];
};

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function money(value: number | null | undefined) {
  return `QAR ${(value ?? 0).toFixed(2)}`;
}

function itemsHtml(items: OrderItemEmail[]) {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #efe4da;">${escapeHtml(item.productName)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #efe4da;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #efe4da;text-align:right;">${money(item.total)}</td>
        </tr>`,
    )
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#FEF9F6;font-family:Georgia,serif;color:#2a1f16;">
    <div style="max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e8ddd2;border-radius:16px;overflow:hidden;">
      <div style="background:#17100a;padding:20px 24px;">
        <p style="margin:0;color:#c4a574;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Solv</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:500;">${title}</h1>
      </div>
      <div style="padding:24px;">${body}</div>
    </div>
  </body>
</html>`;
}

export function buildAdminNewOrderEmail(order: OrderEmailPayload) {
  const subject = `New order ${order.orderNumber}`;
  const html = layout(
    "New order received",
    `
      <p style="margin:0 0 16px;color:#7a6b5d;font-family:Arial,sans-serif;font-size:14px;">
        A guest placed an order. Payment: cash on delivery.
      </p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Customer:</strong> ${escapeHtml(order.guestName)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Email:</strong> ${escapeHtml(order.guestEmail)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Phone:</strong> ${escapeHtml(order.guestPhone)}</p>
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;"><strong>Delivery:</strong> ${escapeHtml(order.deliveryAddress)}, ${escapeHtml(order.deliveryCity)}</p>
      <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding-bottom:8px;color:#8a7a6c;">Item</th>
            <th style="text-align:center;padding-bottom:8px;color:#8a7a6c;">Qty</th>
            <th style="text-align:right;padding-bottom:8px;color:#8a7a6c;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml(order.items)}</tbody>
      </table>
      <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:15px;"><strong>Total:</strong> ${money(order.total)}</p>
    `,
  );
  return { subject, html };
}

export function buildCustomerStatusEmail(
  order: OrderEmailPayload,
  previousStatus: string,
) {
  const label = statusLabel(order.status);
  const subject = `Order ${order.orderNumber} is now ${label}`;
  const html = layout(
    "Order status update",
    `
      <p style="margin:0 0 16px;color:#7a6b5d;font-family:Arial,sans-serif;font-size:14px;">
        Hi ${escapeHtml(order.guestName)}, your Solv order status changed.
      </p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Previous:</strong> ${escapeHtml(statusLabel(previousStatus))}</p>
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;"><strong>Current:</strong> ${escapeHtml(label)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Delivery:</strong> ${escapeHtml(order.deliveryAddress)}, ${escapeHtml(order.deliveryCity)}</p>
      <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:15px;"><strong>Total:</strong> ${money(order.total)} (cash on delivery)</p>
    `,
  );
  return { subject, html };
}

export function toOrderEmailPayload(order: {
  orderNumber: string;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes: string | null;
  subtotal: number | null;
  deliveryFee: number | null;
  total: number | null;
  items: Array<{
    productName: string;
    quantity: number;
    total: number | null;
  }>;
}): OrderEmailPayload {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    guestName: order.guestName,
    guestEmail: order.guestEmail,
    guestPhone: order.guestPhone,
    deliveryCity: order.deliveryCity,
    deliveryAddress: order.deliveryAddress,
    notes: order.notes,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      total: item.total,
    })),
  };
}

export function notifyAdminNewOrder(order: OrderEmailPayload) {
  const to = getOrderNotifyAdminEmail();
  if (!to) {
    console.warn("[mail] No admin notify address configured for new order");
    return;
  }
  const { subject, html } = buildAdminNewOrderEmail(order);
  queueMail({ to, subject, html });
}

export function notifyCustomerOrderStatus(
  order: OrderEmailPayload,
  previousStatus: string,
) {
  const to = order.guestEmail?.trim();
  if (!to) {
    console.warn(
      "[mail] No guest email on order; skipped status email:",
      order.orderNumber,
    );
    return;
  }
  const { subject, html } = buildCustomerStatusEmail(order, previousStatus);
  queueMail({ to, subject, html });
}
