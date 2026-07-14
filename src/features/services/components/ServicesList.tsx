import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { serviceItems } from "@/features/services/data";

export function ServicesList() {
  return (
    <section className="bg-[#FEF9F6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            What We Offer
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
            Services tailored to taste
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
            Premium products, reliable logistics, and thoughtful guidance — so
            every order feels simple and intentional.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#c4a574]">
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#e8ddd2] bg-[#e8ddd2] sm:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map((service) => {
            const { Icon } = service;
            return (
              <article
                key={service.id}
                className="flex flex-col bg-[#FEF9F6] px-6 py-8 sm:px-7 sm:py-9 md:px-8 md:py-10"
              >
                <Icon className="mb-4 size-11 text-[#c4a574] sm:size-12" />
                <h3 className="font-serif text-xl font-semibold text-[#2a1f16] sm:text-[1.35rem]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7a6b5d] sm:mt-3 sm:text-[15px]">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-[#e8ddd2] pt-5">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-[#5c4f43]"
                    >
                      <span
                        className="mt-2 size-1 shrink-0 rounded-full bg-[#c4a574]"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
