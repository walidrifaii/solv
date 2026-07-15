import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminDeleteProduct,
  adminGetProduct,
  adminUpdateProduct,
} from "@/server/services/admin-product.service";
import { updateProductSchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminGetProduct(String(params.id ?? ""));
});

export const PUT = isAdmin(async (req: NextRequest, ctx) => {
  const params = (await ctx.params) ?? {};
  const body = updateProductSchema.parse(await req.json());
  return adminUpdateProduct(String(params.id ?? ""), body);
});

export const DELETE = isAdmin(async (_req, ctx) => {
  const params = (await ctx.params) ?? {};
  return adminDeleteProduct(String(params.id ?? ""));
});
