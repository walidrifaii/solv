import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Solv",
  description: "Sign in to your SOLV account with email.",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AuthShell>
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-md py-8 text-sm text-[#7a6b5d]">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthShell>
    </main>
  );
}
