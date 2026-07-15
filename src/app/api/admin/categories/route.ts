import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminCreateCategory,
  adminListCategories,
} from "@/server/services/admin-category.service";
import {
  adminCategoryListQuerySchema,
  createCategorySchema,
} from "@/server/validators/schemas";

export const GET = isAdmin(async (req: NextRequest) => {
  const query = adminCategoryListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  return adminListCategories(query);
});

export const POST = isAdmin(async (req: NextRequest) => {
  const body = createCategorySchema.parse(await req.json());
  return adminCreateCategory(body);
});
