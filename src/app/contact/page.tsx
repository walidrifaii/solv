import type { Metadata } from "next";
import { ContactHero } from "@/features/contact/components/ContactHero";
import { ContactSection } from "@/features/contact/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us | Solv",
  description:
    "Contact SOLV Coffee & Tea Supplier in Qatar — send a message, call, or email for orders, wholesale, and support.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ContactHero />
      <ContactSection />
    </main>
  );
}
