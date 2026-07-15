import { NextRequest } from "next/server";
import { publicRoute, requireRefreshCookie } from "@/server/middleware";
import { logoutClient } from "@/server/services/auth.service";

export const POST = publicRoute(async (req: NextRequest) => {
  const refreshToken = requireRefreshCookie(req);
  return logoutClient(refreshToken);
});
