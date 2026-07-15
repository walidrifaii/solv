import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/features/dashboard/components/DashboardLayoutClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | Solv",
  description: "SOLV admin workspace for orders, catalog, and subscribers.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
