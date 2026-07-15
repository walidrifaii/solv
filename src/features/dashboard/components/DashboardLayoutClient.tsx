"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { ROUTES } from "@/constants/routes";

export function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === ROUTES.dashboardLogin) {
    return <>{children}</>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
