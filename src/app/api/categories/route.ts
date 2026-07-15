import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { listCategories } from "@/server/services/category.service";
import { ok } from "@/server/utils/http";
import { categoryListQuerySchema } from "@/server/validators/schemas";

export const GET = publicRoute(async (req: NextRequest) => {
  const query = categoryListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  const result = await listCategories(query);
  return ok(result.items, { meta: result.meta });
});
