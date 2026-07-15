import { NextRequest, NextResponse } from "next/server";
import { publicRoute } from "@/server/middleware";
import { getOpenApiDocument } from "@/server/swagger/openapi";
import { getPublicOrigin } from "@/server/utils/origin";

export const GET = publicRoute(async (req: NextRequest) => {
  const origin = getPublicOrigin(req);
  const doc = getOpenApiDocument(origin);

  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
});
