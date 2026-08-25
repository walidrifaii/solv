import type { Metadata } from "next";
import { LegalPageView } from "@/features/legal/components/LegalPageView";

export const metadata: Metadata = {
  title: "Privacy Policy | Solv",
  description: "How SOLV Coffee & Tea collects and protects your personal information.",
};

export default function PrivacyPage() {
  return <LegalPageView pageKey="privacy" />;
}
