import type { Metadata } from "next";
import { LegalPageView } from "@/features/legal/components/LegalPageView";

export const metadata: Metadata = {
  title: "FAQs | Solv",
  description: "Frequently asked questions about SOLV orders, delivery, and products.",
};

export default function FaqsPage() {
  return <LegalPageView pageKey="faqs" />;
}
