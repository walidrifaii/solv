import { publicRoute } from "@/server/middleware";
import { getProductBySlug } from "@/server/services/product.service";
import { ok } from "@/server/utils/http";

export const GET = publicRoute(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  const slug = String(params.slug ?? "");
  const product = await getProductBySlug(slug);
  return ok(product);
});
