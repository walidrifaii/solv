import { NextRequest } from "next/server";
import { isLogin } from "@/server/middleware";
import { changeClientPassword } from "@/server/services/auth.service";
import { ok } from "@/server/utils/http";
import { changePasswordSchema } from "@/server/validators/schemas";

export const PUT = isLogin(async (req: NextRequest, _ctx, client) => {
  const body = changePasswordSchema.parse(await req.json());
  const result = await changeClientPassword(client.id, body);
  return ok(result);
});
