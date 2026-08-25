import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { listActivePromoBanners } from "@/server/services/promo-banner.service";
import { ok } from "@/server/utils/http";
import { promoBannerListQuerySchema } from "@/server/validators/schemas";

export const GET = publicRoute(async (req: NextRequest) => {
  const query = promoBannerListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  const result = await listActivePromoBanners(query);
  return ok(result.items, { meta: result.meta });
});
