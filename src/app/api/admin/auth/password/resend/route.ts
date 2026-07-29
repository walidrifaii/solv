import { isAdmin } from "@/server/middleware/isAdmin";
import { resendAdminPasswordChangeOtp } from "@/server/services/admin-auth.service";
import { ok } from "@/server/utils/http";

export const POST = isAdmin(async (_req, _ctx, admin) => {
  const result = await resendAdminPasswordChangeOtp(admin.id);
  return ok(result);
});
