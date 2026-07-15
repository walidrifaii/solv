import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function allowedOrigins() {
  const fromEnv = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const appUrl = process.env.APP_URL?.trim();
  const list = [...DEFAULT_ORIGINS, ...fromEnv];
  if (appUrl && /^https?:\/\//i.test(appUrl)) {
    list.push(appUrl.replace(/\/$/, ""));
  }
  return [...new Set(list)];
}

export function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowed = allowedOrigins();
  const headers = new Headers();

  // Same-origin / no Origin header — allow quietly
  if (!origin) {
    return headers;
  }

  // Always allow the request's own host (Swagger on this app)
  const requestOrigin = req.nextUrl.origin;
  const isAllowed =
    allowed.includes(origin) ||
    allowed.includes("*") ||
    origin === requestOrigin;

  if (isAllowed) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );
    headers.set("Vary", "Origin");
  }

  return headers;
}

export function withCors(req: NextRequest, response: NextResponse) {
  const headers = corsHeaders(req);
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}

export function preflight(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return withCors(req, response);
}
