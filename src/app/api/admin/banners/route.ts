import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminCreatePromoBanner,
  adminListPromoBanners,
} from "@/server/services/admin-promo-banner.service";
import {
  adminPromoBannerListQuerySchema,
  createPromoBannerSchema,
} from "@/server/validators/schemas";

export const GET = isAdmin(async (req: NextRequest) => {
  const query = adminPromoBannerListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  return adminListPromoBanners(query);
});

export const POST = isAdmin(async (req: NextRequest) => {
  const body = createPromoBannerSchema.parse(await req.json());
  return adminCreatePromoBanner(body);
});
