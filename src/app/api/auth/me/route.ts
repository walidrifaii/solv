import { isLogin } from "@/server/middleware";
import { getClientProfile } from "@/server/services/auth.service";
import { ok } from "@/server/utils/http";

export const GET = isLogin(async (_req, _ctx, client) => {
  const profile = await getClientProfile(client.id);
  return ok({ client: profile });
});
