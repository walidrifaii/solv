import { NextRequest } from "next/server";
import { publicRoute, requireRefreshCookie } from "@/server/middleware";
import { refreshSession } from "@/server/services/auth.service";
import { ApiError } from "@/server/utils/http";

export const POST = publicRoute(async (req: NextRequest) => {
  const refreshToken = requireRefreshCookie(req);
  if (!refreshToken) {
    throw new ApiError("Refresh token cookie missing", 401);
  }
  return refreshSession(refreshToken);
});
