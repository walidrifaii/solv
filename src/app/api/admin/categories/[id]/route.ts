import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminDeleteCategory,
  adminGetCategory,
  adminUpdateCategory,
} from "@/server/services/admin-category.service";
import { updateCategorySchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminGetCategory(String(params.id ?? ""));
});

export const PUT = isAdmin(async (req: NextRequest, ctx) => {
  const params = (await ctx.params) ?? {};
  const body = updateCategorySchema.parse(await req.json());
  return adminUpdateCategory(String(params.id ?? ""), body);
});

export const DELETE = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminDeleteCategory(String(params.id ?? ""));
});
