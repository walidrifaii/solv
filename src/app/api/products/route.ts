import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { listProducts } from "@/server/services/product.service";
import { ok } from "@/server/utils/http";
import { productListQuerySchema } from "@/server/validators/schemas";

export const GET = publicRoute(async (req: NextRequest) => {
  const query = productListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  const result = await listProducts(query);
  return ok(result.items, { meta: result.meta });
});
