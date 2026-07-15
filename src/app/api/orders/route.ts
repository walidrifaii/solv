import { NextRequest } from "next/server";
import { isLogin, optionalAuth } from "@/server/middleware";
import {
  createOrder,
  listClientOrders,
} from "@/server/services/order.service";
import { ok } from "@/server/utils/http";
import { paginationQuerySchema } from "@/server/utils/pagination";
import { createOrderSchema } from "@/server/validators/schemas";

export const GET = isLogin(async (req: NextRequest, _ctx, client) => {
  const query = paginationQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  const result = await listClientOrders(client.id, query);
  return ok(result.items, { meta: result.meta });
});

export const POST = optionalAuth(async (req: NextRequest, _ctx, client) => {
  const body = createOrderSchema.parse(await req.json());
  const order = await createOrder(body, client?.id ?? null);
  return ok(order, { status: 201 });
});
