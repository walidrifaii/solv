import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  dashboardLocale,
  defaultLocale,
  isLocale,
  localeCookieName,
} from "@/i18n/config";
import { corsHeaders } from "@/server/middleware/cors";

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export function proxy(request: NextRequest) {
  // Handle CORS preflight for API routes at the edge
  if (request.method === "OPTIONS" && request.nextUrl.pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    const headers = corsHeaders(request);
    headers.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  response.headers.set("x-pathname", pathname);

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  if (!isLocale(cookieLocale)) {
    const locale = isDashboardPath(pathname) ? dashboardLocale : defaultLocale;
    response.cookies.set(localeCookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
