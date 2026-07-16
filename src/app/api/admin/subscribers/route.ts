import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import { adminListSubscribers } from "@/server/services/admin-subscriber.service";
import { adminSubscriberListQuerySchema } from "@/server/validators/schemas";

export const GET = isAdmin(async (req: NextRequest) => {
  const query = adminSubscriberListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  return adminListSubscribers(query);
});
