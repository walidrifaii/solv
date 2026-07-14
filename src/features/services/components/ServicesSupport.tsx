import { servicesSupport } from "@/features/services/data";

export function ServicesSupport() {
  const { Icon } = servicesSupport;
  const { highlight } = servicesSupport;

  return (
    <section className="bg-[#F6EDE6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center text-center lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
        <div className="max-w-xl">
          <Icon className="mx-auto mb-4 size-12 text-[#c4a574] lg:mx-0" />
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {servicesSupport.eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl">
            {servicesSupport.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
            {servicesSupport.description}
          </p>
        </div>

        <div className="mt-8 w-full max-w-md space-y-4 border-t border-[#e0d2c4] pt-8 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-[#b0895b] uppercase">
              Phone
            </p>
            <a
              href={highlight.phoneHref}
              className="mt-1 block font-serif text-xl text-[#2a1f16] transition-colors hover:text-[#c4a574] sm:text-2xl"
            >
              {highlight.phone}
            </a>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-[#b0895b] uppercase">
              Email
            </p>
            <a
              href={highlight.emailHref}
              className="mt-1 block text-base text-[#2a1f16] transition-colors hover:text-[#c4a574] sm:text-lg"
            >
              {highlight.email}
            </a>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-[#b0895b] uppercase">
              Hours
            </p>
            <p className="mt-1 text-sm text-[#7a6b5d] sm:text-base">
              {highlight.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
