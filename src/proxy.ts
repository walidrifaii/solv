import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/server/middleware/cors";

export function proxy(request: NextRequest) {
  // Handle CORS preflight for API routes at the edge
  if (request.method === "OPTIONS" && request.nextUrl.pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    const headers = corsHeaders(request);
    headers.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
