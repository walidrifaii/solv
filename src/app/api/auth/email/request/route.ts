import { NextRequest } from "next/server";
import { isLogin } from "@/server/middleware";
import { requestClientEmailChange } from "@/server/services/auth.service";
import { ok } from "@/server/utils/http";
import { requestEmailChangeSchema } from "@/server/validators/schemas";

export const POST = isLogin(async (req: NextRequest, _ctx, client) => {
  const body = requestEmailChangeSchema.parse(await req.json());
  const result = await requestClientEmailChange(client.id, body);
  return ok(result);
});
