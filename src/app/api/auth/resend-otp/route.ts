import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { resendRegisterOtp } from "@/server/services/auth.service";
import { resendOtpSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = resendOtpSchema.parse(await req.json());
  return resendRegisterOtp(body);
});
