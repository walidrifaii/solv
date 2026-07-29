import { publicRoute } from "@/server/middleware";
import { listCities } from "@/server/services/city.service";
import { ok } from "@/server/utils/http";

export const GET = publicRoute(async () => {
  const items = await listCities();
  return ok(items);
});
