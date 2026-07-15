import { isAdmin } from "@/server/middleware/isAdmin";
import { adminDashboardOverview } from "@/server/services/admin-dashboard.service";

export const GET = isAdmin(async () => adminDashboardOverview());
