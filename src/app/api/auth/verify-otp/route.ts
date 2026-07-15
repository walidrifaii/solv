import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { verifyRegisterOtp } from "@/server/services/auth.service";
import { verifyOtpSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = verifyOtpSchema.parse(await req.json());
  return verifyRegisterOtp(body);
});
