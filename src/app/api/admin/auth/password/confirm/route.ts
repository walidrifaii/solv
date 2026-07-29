import type { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import { confirmAdminPasswordChange } from "@/server/services/admin-auth.service";
import { ok } from "@/server/utils/http";
import { adminConfirmPasswordChangeSchema } from "@/server/validators/schemas";

export const POST = isAdmin(async (req: NextRequest, _ctx, admin) => {
  const body = adminConfirmPasswordChangeSchema.parse(await req.json());
  const result = await confirmAdminPasswordChange(admin.id, body);
  return ok(result);
});
