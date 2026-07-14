import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Solv",
  description: "Create your SOLV account with email.",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AuthShell>
        <RegisterForm />
      </AuthShell>
    </main>
  );
}
