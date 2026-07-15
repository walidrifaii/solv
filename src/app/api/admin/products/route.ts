import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminCreateProduct,
  adminListProducts,
} from "@/server/services/admin-product.service";
import {
  adminProductListQuerySchema,
  createProductSchema,
} from "@/server/validators/schemas";

export const GET = isAdmin(async (req: NextRequest) => {
  const query = adminProductListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  return adminListProducts(query);
});

export const POST = isAdmin(async (req: NextRequest) => {
  const body = createProductSchema.parse(await req.json());
  return adminCreateProduct(body);
});
