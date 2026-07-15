import { NextRequest, NextResponse } from "next/server";
import { publicRoute } from "@/server/middleware";
import { getOpenApiDocument } from "@/server/swagger/openapi";

export const GET = publicRoute(async (req: NextRequest) => {
  const doc = getOpenApiDocument(req.nextUrl.origin);
  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": req.nextUrl.origin,
      "Access-Control-Allow-Credentials": "true",
    },
  });
});
