import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminDeleteSlide,
  adminGetSlide,
  adminUpdateSlide,
} from "@/server/services/admin-slide.service";
import { updateSlideSchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminGetSlide(String(params.id ?? ""));
});

export const PUT = isAdmin(async (req: NextRequest, ctx) => {
  const params = (await ctx.params) ?? {};
  const body = updateSlideSchema.parse(await req.json());
  return adminUpdateSlide(String(params.id ?? ""), body);
});

export const DELETE = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminDeleteSlide(String(params.id ?? ""));
});
