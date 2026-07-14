import Image from "next/image";
import heroImage from "@/assets/images/hero.png";
import { contactHero } from "@/features/contact/data";

export function ContactHero() {
  return (
    <section className="relative isolate min-h-[42svh] w-full overflow-hidden bg-[#17100a] text-white sm:min-h-[48svh] md:min-h-[52svh]">
      <Image
        src={heroImage}
        alt="SOLV coffee and tea"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#17100a] via-[#17100a]/60 to-[#17100a]/30" />

      <div className="relative z-10 mx-auto flex min-h-[42svh] w-full max-w-[1400px] flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[48svh] sm:px-6 sm:pb-12 sm:pt-24 md:min-h-[52svh] md:justify-center md:px-8 md:pb-14 lg:px-10">
        <div className="max-w-2xl animate-[heroFade_0.6s_ease-out]">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#c4a574] uppercase sm:mb-4 sm:text-xs">
            {contactHero.eyebrow}
          </p>
          <p className="font-serif text-5xl leading-none font-medium tracking-[0.06em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {contactHero.brand}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-2xl leading-snug font-medium text-white/95 sm:mt-5 sm:text-3xl md:text-4xl">
            {contactHero.title}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
            {contactHero.description}
          </p>
        </div>
      </div>
    </section>
  );
}
