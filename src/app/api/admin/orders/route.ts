import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import { adminListOrders } from "@/server/services/admin-order.service";
import { adminOrderListQuerySchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (req: NextRequest) => {
  const query = adminOrderListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  return adminListOrders(query);
});
