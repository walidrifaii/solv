import type { DiscountType, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { toNumber } from "@/server/utils/crypto";
import { ApiError } from "@/server/utils/http";
import type { createOrderSchema } from "@/server/validators/schemas";
import type { z } from "zod";

type CreateOrderInput = z.infer<typeof createOrderSchema>;

function unitFinalPrice(
  price: number,
  discountType: DiscountType | null,
  discount: number | null,
) {
  if (discountType === "FIXED" && discount != null) {
    return Math.max(0, price - discount);
  }
  if (discountType === "PERCENTAGE" && discount != null) {
    return Math.max(0, price - (price * discount) / 100);
  }
  return price;
}

function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `SOLV-${stamp}-${rand}`;
}

export async function createOrder(
  input: CreateOrderInput,
  clientId: string | null,
) {
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  if (products.length !== new Set(productIds).size) {
    throw new ApiError("One or more products are unavailable", 400);
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const lineItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = byId.get(item.productId);
    if (!product) {
      throw new ApiError(`Product not found: ${item.productId}`, 400);
    }
    if (!product.inStock || product.quantity < item.quantity) {
      throw new ApiError(`Insufficient stock for ${product.name}`, 400);
    }

    const unitPrice = toNumber(product.price) ?? 0;
    const discount = toNumber(product.discount);
    const unit = unitFinalPrice(unitPrice, product.discountType, discount);
    const lineTotal = Number((unit * item.quantity).toFixed(2));
    subtotal += lineTotal;

    lineItems.push({
      product: { connect: { id: product.id } },
      productSlug: product.slug,
      productName: product.name,
      imagePath: product.imagePath,
      unitPrice,
      discountType: product.discountType,
      discount: discount,
      quantity: item.quantity,
      total: lineTotal,
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const deliveryFee = Number(input.deliveryFee.toFixed(2));
  const total = Number((subtotal + deliveryFee).toFixed(2));

  const order = await prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      const product = byId.get(item.productId)!;
      const updated = await tx.product.updateMany({
        where: {
          id: product.id,
          quantity: { gte: item.quantity },
        },
        data: {
          quantity: { decrement: item.quantity },
        },
      });
      if (updated.count === 0) {
        throw new ApiError(`Insufficient stock for ${product.name}`, 400);
      }
      await tx.product.updateMany({
        where: { id: product.id, quantity: { lte: 0 } },
        data: { inStock: false, quantity: 0 },
      });
    }

    return tx.order.create({
      data: {
        orderNumber: makeOrderNumber(),
        clientId,
        subtotal,
        deliveryFee,
        total,
        guestName: input.guestName,
        guestEmail: input.guestEmail.toLowerCase(),
        guestPhone: input.guestPhone,
        deliveryCity: input.deliveryCity,
        deliveryAddress: input.deliveryAddress,
        notes: input.notes || null,
        items: { create: lineItems },
      },
      include: { items: true },
    });
  });

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
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productSlug: item.productSlug,
      productName: item.productName,
      imagePath: item.imagePath || null,
      unitPrice: toNumber(item.unitPrice),
      discountType: item.discountType,
      discount: toNumber(item.discount),
      quantity: item.quantity,
      total: toNumber(item.total),
    })),
  };
}

export async function listClientOrders(
  clientId: string,
  query: { page: number; limit: number },
) {
  const skip = (query.page - 1) * query.limit;
  const where = { clientId };

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return {
    items: rows.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: toNumber(order.subtotal),
      deliveryFee: toNumber(order.deliveryFee),
      total: toNumber(order.total),
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.length,
    })),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    },
  };
}
