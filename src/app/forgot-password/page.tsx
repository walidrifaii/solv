import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Solv",
  description: "Reset your SOLV account password via WhatsApp or email.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AuthShell>
        <Suspense fallback={null}>
          <ForgotPasswordForm />
        </Suspense>
      </AuthShell>
    </main>
  );
}
