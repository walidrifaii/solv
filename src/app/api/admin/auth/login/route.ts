import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { loginAdmin } from "@/server/services/admin-auth.service";
import { loginSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = loginSchema.parse(await req.json());
  return loginAdmin(body);
});
