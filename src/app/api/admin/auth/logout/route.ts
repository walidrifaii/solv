import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { requireAdminRefreshCookie } from "@/server/middleware/isAdmin";
import { logoutAdmin } from "@/server/services/admin-auth.service";

export const POST = publicRoute(async (req: NextRequest) => {
  const refreshToken = requireAdminRefreshCookie(req);
  return logoutAdmin(refreshToken);
});
