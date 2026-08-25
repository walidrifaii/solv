import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminDeletePromoBanner,
  adminGetPromoBanner,
  adminUpdatePromoBanner,
} from "@/server/services/admin-promo-banner.service";
import { updatePromoBannerSchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminGetPromoBanner(String(params.id ?? ""));
});

export const PUT = isAdmin(async (req: NextRequest, ctx) => {
  const params = (await ctx.params) ?? {};
  const body = updatePromoBannerSchema.parse(await req.json());
  return adminUpdatePromoBanner(String(params.id ?? ""), body);
});

export const DELETE = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminDeletePromoBanner(String(params.id ?? ""));
});
