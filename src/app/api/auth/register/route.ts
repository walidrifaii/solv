import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { registerClient } from "@/server/services/auth.service";
import { registerSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = registerSchema.parse(await req.json());
  return registerClient(body);
});
