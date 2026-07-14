import Image from "next/image";
import audienceImage from "@/assets/images/quality-showcase.png";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { servicesAudience } from "@/features/services/data";

export function ServicesAudience() {
  return (
    <section className="bg-[#F6EDE6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {servicesAudience.eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.5rem]">
            {servicesAudience.title}
          </h2>
          <div className="mt-4 flex items-center gap-3 text-[#c4a574]">
            <span className="h-px w-10 bg-[#c4a574]/70 sm:w-14" />
            <OrnamentIcon className="size-3.5" />
            <span className="h-px w-10 bg-[#c4a574]/70 sm:w-14" />
          </div>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#7a6b5d] sm:mt-6 sm:text-base">
            {servicesAudience.description}
          </p>

          <ul className="mt-8 space-y-6 sm:mt-10">
            {servicesAudience.groups.map((group, index) => (
              <li
                key={group.id}
                className={`flex gap-4 sm:gap-5 ${
                  index > 0 ? "border-t border-[#e0d2c4] pt-6" : ""
                }`}
              >
                <span className="font-serif text-2xl leading-none font-medium text-[#c4a574] sm:text-3xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2a1f16] sm:text-xl">
                    {group.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#7a6b5d] sm:text-[15px]">
                    {group.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[16rem] overflow-hidden sm:min-h-[20rem] lg:min-h-[28rem]">
          <Image
            src={audienceImage}
            alt="SOLV premium coffee and tea assortment for service clients"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
