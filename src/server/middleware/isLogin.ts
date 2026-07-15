import type { NextRequest } from "next/server";
import {
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
} from "@/server/auth/cookies";
import { verifyAccessToken } from "@/server/auth/jwt";
import { fail, handleRouteError } from "@/server/utils/http";

export type AuthClient = {
  id: string;
  email: string;
};

type RouteContext = {
  params?: Promise<Record<string, string | string[]>>;
};

export type AuthenticatedHandler = (
  req: NextRequest,
  ctx: RouteContext,
  client: AuthClient,
) => Promise<Response> | Response;

export type OptionalAuthHandler = (
  req: NextRequest,
  ctx: RouteContext,
  client: AuthClient | null,
) => Promise<Response> | Response;

export type PublicHandler = (
  req: NextRequest,
  ctx: RouteContext,
) => Promise<Response> | Response;

export async function getClientFromRequest(req: NextRequest) {
  const token = getAccessTokenFromRequest(req);
  if (!token) return null;
  return verifyAccessToken(token);
}

/** Requires a valid access JWT cookie (`solv_access`). */
export function isLogin(handler: AuthenticatedHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    try {
      const client = await getClientFromRequest(req);
      if (!client) {
        return fail("Unauthorized — please log in", 401);
      }
      return await handler(req, ctx, client);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}

/** Attaches client when access cookie is valid; otherwise continues as guest. */
export function optionalAuth(handler: OptionalAuthHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    try {
      const client = await getClientFromRequest(req);
      return await handler(req, ctx, client);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}

/** Public route wrapper with shared error handling. */
export function publicRoute(handler: PublicHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}

export function requireRefreshCookie(req: NextRequest) {
  const token = getRefreshTokenFromRequest(req);
  if (!token) {
    return null;
  }
  return token;
}
