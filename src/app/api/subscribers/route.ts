import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { subscribeEmail } from "@/server/services/subscriber.service";
import { ok } from "@/server/utils/http";
import { subscribeSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = subscribeSchema.parse(await req.json());
  const subscriber = await subscribeEmail(body.email);
  return ok(subscriber, { status: 201 });
});
