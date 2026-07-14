import type { Metadata } from "next";
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
        <LoginForm />
      </AuthShell>
    </main>
  );
}
