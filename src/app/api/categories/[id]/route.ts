import { publicRoute } from "@/server/middleware";
import { getCategoryByIdOrSlug } from "@/server/services/category.service";
import { ok } from "@/server/utils/http";

export const GET = publicRoute(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  const id = String(params.id ?? "");
  const category = await getCategoryByIdOrSlug(id);
  return ok(category);
});
