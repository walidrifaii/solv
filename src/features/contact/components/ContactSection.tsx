import { ContactDetails } from "@/features/contact/components/ContactDetails";
import { ContactForm } from "@/features/contact/components/ContactForm";

export function ContactSection() {
  return (
    <section className="bg-[#FEF9F6] text-[#2a1f16]">
      <div className="mx-auto grid w-full max-w-[1400px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-10 lg:py-16">
          <ContactForm />
        </div>
        <ContactDetails />
      </div>
    </section>
  );
}
