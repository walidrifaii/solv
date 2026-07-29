import type { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import { requestAdminPasswordChange } from "@/server/services/admin-auth.service";
import { ok } from "@/server/utils/http";
import { adminRequestPasswordChangeSchema } from "@/server/validators/schemas";

export const POST = isAdmin(async (req: NextRequest, _ctx, admin) => {
  const body = adminRequestPasswordChangeSchema.parse(await req.json());
  const result = await requestAdminPasswordChange(admin.id, body);
  return ok(result);
});
