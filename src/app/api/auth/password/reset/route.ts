import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { resetPassword } from "@/server/services/auth.service";
import { resetPasswordSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = resetPasswordSchema.parse(await req.json());
  return resetPassword(body);
});
