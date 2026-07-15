import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { VerifyForm } from "@/features/auth/components/VerifyForm";

export const metadata: Metadata = {
  title: "Verify Email | Solv",
  description: "Enter the code we sent to open your SOLV account.",
};

export default function VerifyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AuthShell>
        <Suspense fallback={<p className="text-[#7a6b5d]">Loading…</p>}>
          <VerifyForm />
        </Suspense>
      </AuthShell>
    </main>
  );
}
