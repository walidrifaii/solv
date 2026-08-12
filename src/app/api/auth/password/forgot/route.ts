import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { forgotPassword } from "@/server/services/auth.service";
import { forgotPasswordSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = forgotPasswordSchema.parse(await req.json());
  return forgotPassword(body);
});
