import { publicRoute } from "@/server/middleware";
import { listCountries } from "@/server/services/country.service";
import { ok } from "@/server/utils/http";

export const GET = publicRoute(async () => {
  const items = await listCountries();
  return ok(items);
});
