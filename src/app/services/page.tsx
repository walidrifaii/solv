import type { Metadata } from "next";
import { ServicesAudience } from "@/features/services/components/ServicesAudience";
import { ServicesHero } from "@/features/services/components/ServicesHero";
import { ServicesList } from "@/features/services/components/ServicesList";
import { ServicesProcess } from "@/features/services/components/ServicesProcess";
import { ServicesSupport } from "@/features/services/components/ServicesSupport";

export const metadata: Metadata = {
  title: "Services | Solv",
  description:
    "SOLV services in Qatar — home and hospitality supply, wholesale, delivery, corporate gifting, and product guidance.",
};

export default function ServicesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ServicesHero />
      <ServicesList />
      <ServicesAudience />
      <ServicesProcess />
      <ServicesSupport />
    </main>
  );
}
