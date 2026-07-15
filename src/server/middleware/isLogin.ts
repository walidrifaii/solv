import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
} from "@/server/auth/cookies";
import { verifyAccessToken } from "@/server/auth/jwt";
import { preflight, withCors } from "@/server/middleware/cors";
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

function asNextResponse(response: Response) {
  if (response instanceof NextResponse) return response;
  return new NextResponse(response.body, response);
}

async function finalize(req: NextRequest, response: Response) {
  return withCors(req, asNextResponse(response));
}

export async function getClientFromRequest(req: NextRequest) {
  const token = getAccessTokenFromRequest(req);
  if (!token) return null;
  return verifyAccessToken(token);
}

/** Requires a valid access JWT cookie (`solv_access`). */
export function isLogin(handler: AuthenticatedHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    if (req.method === "OPTIONS") return preflight(req);
    try {
      const client = await getClientFromRequest(req);
      if (!client) {
        return finalize(req, fail("Unauthorized — please log in", 401));
      }
      return finalize(req, await handler(req, ctx, client));
    } catch (error) {
      return finalize(req, handleRouteError(error));
    }
  };
}

/** Attaches client when access cookie is valid; otherwise continues as guest. */
export function optionalAuth(handler: OptionalAuthHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    if (req.method === "OPTIONS") return preflight(req);
    try {
      const client = await getClientFromRequest(req);
      return finalize(req, await handler(req, ctx, client));
    } catch (error) {
      return finalize(req, handleRouteError(error));
    }
  };
}

/** Public route wrapper with shared error handling. */
export function publicRoute(handler: PublicHandler) {
  return async (req: NextRequest, ctx: RouteContext = {}) => {
    if (req.method === "OPTIONS") return preflight(req);
    try {
      return finalize(req, await handler(req, ctx));
    } catch (error) {
      return finalize(req, handleRouteError(error));
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
