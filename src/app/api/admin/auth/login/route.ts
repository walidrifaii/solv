import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { loginAdmin } from "@/server/services/admin-auth.service";
import { adminLoginSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = adminLoginSchema.parse(await req.json());
  return loginAdmin(body);
});
