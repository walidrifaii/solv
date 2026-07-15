import type { OrderStatus, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import {
  notifyCustomerOrderStatus,
  toOrderEmailPayload,
} from "@/server/mail/order-emails";
import { toNumber } from "@/server/utils/crypto";
import { ApiError, ok } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";
import type {
  adminOrderListQuerySchema,
  updateOrderStatusSchema,
} from "@/server/validators/schemas";
import type { z } from "zod";

type ListQuery = z.infer<typeof adminOrderListQuerySchema>;
type UpdateStatusInput = z.infer<typeof updateOrderStatusSchema>;

function mapOrderItem(item: {
  id: string;
  productId: string | null;
  productSlug: string;
  productName: string;
  imagePath: string;
  unitPrice: Prisma.Decimal;
  discountType: string | null;
  discount: Prisma.Decimal | null;
  quantity: number;
  total: Prisma.Decimal;
  product?: { imagePath: string } | null;
}) {
  return {
    id: item.id,
    productId: item.productId,
    productSlug: item.productSlug,
    productName: item.productName,
    imagePath: item.product?.imagePath || item.imagePath || null,
    unitPrice: toNumber(item.unitPrice),
    discountType: item.discountType as "FIXED" | "PERCENTAGE" | null,
    discount: toNumber(item.discount),
    quantity: item.quantity,
    total: toNumber(item.total),
  };
}

function mapAdminOrderSummary(order: {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  total: Prisma.Decimal;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: { id: string }[];
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: toNumber(order.subtotal),
    deliveryFee: toNumber(order.deliveryFee),
    total: toNumber(order.total),
    guestName: order.guestName,
    guestEmail: order.guestEmail,
    guestPhone: order.guestPhone,
    deliveryCity: order.deliveryCity,
    deliveryAddress: order.deliveryAddress,
    notes: order.notes,
    itemCount: order.items.length,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

function mapAdminOrderDetail(order: {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  total: Prisma.Decimal;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  clientId: string | null;
  items: {
    id: string;
    productId: string | null;
    productSlug: string;
    productName: string;
    imagePath: string;
    unitPrice: Prisma.Decimal;
    discountType: string | null;
    discount: Prisma.Decimal | null;
    quantity: number;
    total: Prisma.Decimal;
    product?: { imagePath: string } | null;
  }[];
}) {
  return {
    ...mapAdminOrderSummary(order),
    clientId: order.clientId,
    items: order.items.map(mapOrderItem),
  };
}

const includeItemsLite = {
  items: { select: { id: true } },
} as const;

const includeItemsFull = {
  items: {
    include: {
      product: { select: { imagePath: true } },
    },
  },
} as const;

export async function adminListOrders(query: ListQuery) {
  const where: Prisma.OrderWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { orderNumber: { contains: query.search } },
            { guestName: { contains: query.search } },
            { guestEmail: { contains: query.search } },
            { guestPhone: { contains: query.search } },
            { deliveryCity: { contains: query.search } },
          ],
        }
      : {}),
  };

  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: includeItemsLite,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
  ]);

  return ok({
    items: rows.map(mapAdminOrderSummary),
    meta: paginationMeta(total, query.page, query.limit),
  });
}

export async function adminGetOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: includeItemsFull,
  });

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  return ok(mapAdminOrderDetail(order));
}

export async function adminUpdateOrderStatus(
  id: string,
  input: UpdateStatusInput,
) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!existing) {
    throw new ApiError("Order not found", 404);
  }

  const nextStatus = input.status as OrderStatus;

  const previousStatus = existing.status;

  const order = await prisma.$transaction(async (tx) => {
    if (
      nextStatus === "CANCELLED" &&
      existing.status !== "CANCELLED"
    ) {
      for (const item of existing.items) {
        if (!item.productId) continue;
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.quantity },
            inStock: true,
          },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status: nextStatus },
      include: includeItemsFull,
    });
  });

  const detail = mapAdminOrderDetail(order);

  if (previousStatus !== nextStatus) {
    notifyCustomerOrderStatus(
      toOrderEmailPayload({
        orderNumber: detail.orderNumber,
        status: detail.status,
        guestName: detail.guestName,
        guestEmail: detail.guestEmail,
        guestPhone: detail.guestPhone,
        deliveryCity: detail.deliveryCity,
        deliveryAddress: detail.deliveryAddress,
        notes: detail.notes,
        subtotal: detail.subtotal,
        deliveryFee: detail.deliveryFee,
        total: detail.total,
        items: detail.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          total: item.total,
        })),
      }),
      previousStatus,
    );
  }

  return ok(detail);
}
