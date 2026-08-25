import type { Metadata } from "next";
import { LegalPageView } from "@/features/legal/components/LegalPageView";

export const metadata: Metadata = {
  title: "Terms & Conditions | Solv",
  description: "Terms and conditions for shopping with SOLV Coffee & Tea in Qatar.",
};

export default function TermsPage() {
  return <LegalPageView pageKey="terms" />;
}
