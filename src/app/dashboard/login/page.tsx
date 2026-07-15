import type { Metadata } from "next";
import { AdminLoginForm } from "@/features/dashboard/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Solv",
  robots: { index: false, follow: false },
};

export default function DashboardLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FEF9F6] px-4 py-12 text-[#2a1f16]">
      <AdminLoginForm />
    </div>
  );
}
