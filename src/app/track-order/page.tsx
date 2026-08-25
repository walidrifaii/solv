import type { Metadata } from "next";
import { LegalPageView } from "@/features/legal/components/LegalPageView";

export const metadata: Metadata = {
  title: "Track Order | Solv",
  description: "Track your SOLV order status or contact support for delivery updates.",
};

export default function TrackOrderPage() {
  return <LegalPageView pageKey="trackOrder" />;
}
