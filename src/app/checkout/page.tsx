import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Solv",
  description: "Complete your SOLV coffee and tea order for delivery across Qatar.",
};

export default function CheckoutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <CheckoutView />
    </main>
  );
}
