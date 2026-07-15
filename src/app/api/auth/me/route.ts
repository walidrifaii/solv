import { NextRequest } from "next/server";
import { isLogin } from "@/server/middleware";
import {
  getClientProfile,
  updateClientProfile,
} from "@/server/services/auth.service";
import { ok } from "@/server/utils/http";
import { updateProfileSchema } from "@/server/validators/schemas";

export const GET = isLogin(async (_req, _ctx, client) => {
  const profile = await getClientProfile(client.id);
  return ok({ client: profile });
});

export const PATCH = isLogin(async (req: NextRequest, _ctx, client) => {
  const body = updateProfileSchema.parse(await req.json());
  const profile = await updateClientProfile(client.id, body);
  return ok({ client: profile });
});
