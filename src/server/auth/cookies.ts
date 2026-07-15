import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAccessMaxAgeSeconds,
  getRefreshMaxAgeSeconds,
} from "@/server/auth/jwt";

export const ACCESS_COOKIE = "solv_access";
export const REFRESH_COOKIE = "solv_refresh";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...baseCookie,
    maxAge: getAccessMaxAgeSeconds(),
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...baseCookie,
    maxAge: getRefreshMaxAgeSeconds(),
  });
  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { ...baseCookie, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...baseCookie, maxAge: 0 });
  return response;
}

export function getAccessTokenFromRequest(req: NextRequest) {
  return req.cookies.get(ACCESS_COOKIE)?.value ?? null;
}

export function getRefreshTokenFromRequest(req: NextRequest) {
  return req.cookies.get(REFRESH_COOKIE)?.value ?? null;
}
