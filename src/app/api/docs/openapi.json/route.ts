import { NextResponse } from "next/server";
import { publicRoute } from "@/server/middleware";
import { getOpenApiDocument } from "@/server/swagger/openapi";

export const GET = publicRoute(async () => {
  return NextResponse.json(getOpenApiDocument());
});
