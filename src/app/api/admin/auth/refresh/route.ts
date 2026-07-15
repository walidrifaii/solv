import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { requireAdminRefreshCookie } from "@/server/middleware/isAdmin";
import { refreshAdminSession } from "@/server/services/admin-auth.service";
import { ApiError } from "@/server/utils/http";

export const POST = publicRoute(async (req: NextRequest) => {
  const refreshToken = requireAdminRefreshCookie(req);
  if (!refreshToken) {
    throw new ApiError("Admin refresh token cookie missing", 401);
  }
  return refreshAdminSession(refreshToken);
});
