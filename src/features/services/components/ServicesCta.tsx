import Image from "next/image";
import Link from "next/link";
import ctaImage from "@/assets/images/hot-deals-bg.png";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { servicesCta } from "@/features/services/data";

export function ServicesCta() {
  return (
    <section className="relative isolate min-h-[18rem] overflow-hidden bg-[#17100a] text-white sm:min-h-[20rem] md:min-h-[22rem] lg:min-h-[24rem]">
      <Image
        src={ctaImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#17100a]/95 via-[#17100a]/70 to-[#17100a]/45" />

      <div className="relative z-10 mx-auto flex min-h-[18rem] w-full max-w-[1400px] items-center px-4 py-10 sm:min-h-[20rem] sm:px-6 sm:py-12 md:min-h-[22rem] md:px-8 md:py-14 lg:min-h-[24rem] lg:px-10">
        <div className="max-w-xl md:max-w-2xl">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#c4a574] uppercase sm:mb-4 sm:text-xs">
            {servicesCta.eyebrow}
          </p>
          <h2 className="font-serif text-2xl leading-[1.12] font-medium text-white sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            {servicesCta.title}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base">
            {servicesCta.description}
          </p>
          <Link
            href={servicesCta.cta.href}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-[#c4a574] px-5 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] sm:mt-8 sm:px-6 sm:py-3 sm:text-base"
          >
            {servicesCta.cta.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
