import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getAdminAccessTokenFromRequest,
  getAdminRefreshTokenFromRequest,
} from "@/server/auth/cookies";
import { verifyAdminAccessToken } from "@/server/auth/jwt";
import { preflight, withCors } from "@/server/middleware/cors";
import { fail, handleRouteError } from "@/server/utils/http";

export type AuthAdmin = {
  id: string;
  email: string;
};

type RouteContext = {
  params?: Promise<Record<string, string | string[]>>;
};

export type AdminHandler = (
  req: NextRequest,
  ctx: RouteContext,
  admin: AuthAdmin,
) => Promise<Response> | Response;

function asNextResponse(response: Response) {
  if (response instanceof NextResponse) return response;
  return new NextResponse(response.body, response);
}

async function finalize(req: NextRequest, response: Response) {
  return withCors(req, asNextResponse(response));
}

export async function getAdminFromRequest(req: NextRequest) {
  const token = getAdminAccessTokenFromRequest(req);
  if (!token) return null;
  return verifyAdminAccessToken(token);
}

/** Requires a valid admin access JWT cookie (`solv_admin_access`). */
export function isAdmin(handler: AdminHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    if (req.method === "OPTIONS") return preflight(req);
    try {
      const admin = await getAdminFromRequest(req);
      if (!admin) {
        return finalize(req, fail("Unauthorized — admin login required", 401));
      }
      return finalize(req, await handler(req, ctx, admin));
    } catch (error) {
      return finalize(req, handleRouteError(error));
    }
  };
}

export function requireAdminRefreshCookie(req: NextRequest) {
  return getAdminRefreshTokenFromRequest(req);
}
