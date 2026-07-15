import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { loginClient } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = loginSchema.parse(await req.json());
  return loginClient(body);
});
