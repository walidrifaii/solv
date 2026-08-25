import type { Metadata } from "next";
import { LegalPageView } from "@/features/legal/components/LegalPageView";

export const metadata: Metadata = {
  title: "Returns & Refunds | Solv",
  description: "SOLV returns and refunds policy for coffee, tea, and accessories.",
};

export default function ReturnsPage() {
  return <LegalPageView pageKey="returns" />;
}
