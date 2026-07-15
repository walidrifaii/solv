import { prisma } from "@/lib/db";
import { toNumber } from "@/server/utils/crypto";
import { ok } from "@/server/utils/http";

const LOW_STOCK_THRESHOLD = 10;
const RECENT_ORDERS_LIMIT = 5;
const LOW_STOCK_LIMIT = 8;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfYesterday() {
  const d = startOfToday();
  d.setDate(d.getDate() - 1);
  return d;
}

export async function adminDashboardOverview() {
  const today = startOfToday();
  const yesterday = startOfYesterday();

  const [
    totalOrders,
    pendingOrders,
    ordersToday,
    ordersYesterday,
    revenueTodayAgg,
    lowStockCount,
    subscribers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({
      where: { createdAt: { gte: yesterday, lt: today } },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: today },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        OR: [{ quantity: { lte: LOW_STOCK_THRESHOLD } }, { inStock: false }],
      },
    }),
    prisma.subscriber.count({ where: { isActive: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: RECENT_ORDERS_LIMIT,
      select: {
        id: true,
        orderNumber: true,
        guestName: true,
        status: true,
        total: true,
        deliveryCity: true,
        createdAt: true,
      },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [{ quantity: { lte: LOW_STOCK_THRESHOLD } }, { inStock: false }],
      },
      orderBy: [{ quantity: "asc" }, { name: "asc" }],
      take: LOW_STOCK_LIMIT,
      select: {
        id: true,
        name: true,
        imagePath: true,
        quantity: true,
        inStock: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const revenueToday = toNumber(revenueTodayAgg._sum.total) ?? 0;
  const ordersDelta = ordersToday - ordersYesterday;

  return ok({
    stats: {
      ordersToday,
      ordersDelta,
      totalOrders,
      pendingOrders,
      revenueToday,
      lowStockCount,
      subscribers,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    },
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      guestName: order.guestName,
      status: order.status,
      total: toNumber(order.total),
      deliveryCity: order.deliveryCity,
      createdAt: order.createdAt.toISOString(),
    })),
    lowStock: lowStockProducts.map((product) => ({
      id: product.id,
      name: product.name,
      imagePath: product.imagePath,
      quantity: product.quantity,
      inStock: product.inStock,
      category: product.category.name,
    })),
  });
}
