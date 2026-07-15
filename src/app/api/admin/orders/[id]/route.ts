import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminGetOrder,
  adminUpdateOrderStatus,
} from "@/server/services/admin-order.service";
import { updateOrderStatusSchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminGetOrder(String(params.id ?? ""));
});

export const PUT = isAdmin(async (req: NextRequest, ctx) => {
  const params = (await ctx.params) ?? {};
  const body = updateOrderStatusSchema.parse(await req.json());
  return adminUpdateOrderStatus(String(params.id ?? ""), body);
});
