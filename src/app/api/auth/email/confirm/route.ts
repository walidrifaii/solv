import { NextRequest } from "next/server";
import { isLogin } from "@/server/middleware";
import { confirmClientEmailChange } from "@/server/services/auth.service";
import { ok } from "@/server/utils/http";
import { confirmEmailChangeSchema } from "@/server/validators/schemas";

export const POST = isLogin(async (req: NextRequest, _ctx, client) => {
  const body = confirmEmailChangeSchema.parse(await req.json());
  const profile = await confirmClientEmailChange(client.id, body);
  return ok({ client: profile });
});
