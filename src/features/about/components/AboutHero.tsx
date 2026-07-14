import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/images/hero-2.png";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { aboutHero } from "@/features/about/data";

export function AboutHero() {
  return (
    <section className="relative isolate min-h-[58svh] w-full overflow-hidden bg-[#17100a] text-white sm:min-h-[62svh] md:min-h-[68svh]">
      <Image
        src={heroImage}
        alt="SOLV premium coffee and tea arrangement"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#17100a] via-[#17100a]/55 to-[#17100a]/25" />

      <div className="relative z-10 mx-auto flex min-h-[58svh] w-full max-w-[1400px] flex-col justify-end px-4 pb-12 pt-20 sm:min-h-[62svh] sm:px-6 sm:pb-14 sm:pt-24 md:min-h-[68svh] md:justify-center md:px-8 md:pb-16 lg:px-10">
        <div className="max-w-2xl animate-[heroFade_0.6s_ease-out]">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#c4a574] uppercase sm:mb-4 sm:text-xs">
            {aboutHero.eyebrow}
          </p>
          <p className="font-serif text-5xl leading-none font-medium tracking-[0.06em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {aboutHero.brand}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-2xl leading-snug font-medium text-white/95 sm:mt-5 sm:text-3xl md:text-4xl">
            {aboutHero.title}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
            {aboutHero.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
            <Link
              href={aboutHero.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-md bg-[#c4a574] px-5 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] sm:px-6 sm:py-3 sm:text-base"
            >
              {aboutHero.primaryCta.label}
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href={aboutHero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5 sm:px-6 sm:py-3 sm:text-base"
            >
              {aboutHero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
