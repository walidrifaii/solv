import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { listActiveSlides } from "@/server/services/slide.service";
import { ok } from "@/server/utils/http";
import { slideListQuerySchema } from "@/server/validators/schemas";

export const GET = publicRoute(async (req: NextRequest) => {
  const query = slideListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  const result = await listActiveSlides(query);
  return ok(result.items, { meta: result.meta });
});
