import { isAdmin } from "@/server/middleware/isAdmin";
import { getAdminProfile } from "@/server/services/admin-auth.service";
import { ok } from "@/server/utils/http";

export const GET = isAdmin(async (_req, _ctx, admin) => {
  const profile = await getAdminProfile(admin.id);
  return ok({ admin: profile });
});
