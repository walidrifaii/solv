import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Solv",
  description: "Choose a new SOLV account password.",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AuthShell>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </AuthShell>
    </main>
  );
}
