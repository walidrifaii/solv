import Image from "next/image";
import storyImage from "@/assets/images/newsletter-community.png";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { aboutFacts, aboutStory } from "@/features/about/data";

export function AboutStory() {
  return (
    <section className="bg-[#FEF9F6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative min-h-[16rem] overflow-hidden sm:min-h-[18rem] lg:min-h-[28rem]">
          <Image
            src={storyImage}
            alt="SOLV coffee and tea community table setup"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        <div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {aboutStory.eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.5rem]">
            {aboutStory.title}
          </h2>
          <div className="mt-4 flex items-center gap-3 text-[#c4a574]">
            <span className="h-px w-10 bg-[#c4a574]/70 sm:w-14" />
            <OrnamentIcon className="size-3.5" />
            <span className="h-px w-10 bg-[#c4a574]/70 sm:w-14" />
          </div>

          <div className="mt-6 space-y-4 sm:mt-8">
            {aboutStory.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed text-[#7a6b5d] sm:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-8 border-t border-[#e8ddd2] pt-6 text-sm text-[#7a6b5d] sm:mt-10">
            <span className="font-medium tracking-wide text-[#2a1f16] uppercase">
              {aboutStory.highlight.label}
            </span>
            <span className="mx-2 text-[#c4a574]">·</span>
            {aboutStory.highlight.value}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-[1400px] grid-cols-2 gap-px overflow-hidden border border-[#e8ddd2] bg-[#e8ddd2] sm:mt-16 md:grid-cols-4">
        {aboutFacts.map((fact) => (
          <div
            key={fact.label}
            className="bg-[#FEF9F6] px-4 py-5 text-center sm:px-6 sm:py-6"
          >
            <p className="text-[10px] font-medium tracking-[0.18em] text-[#b0895b] uppercase sm:text-[11px]">
              {fact.label}
            </p>
            <p className="mt-2 font-serif text-base font-medium text-[#2a1f16] sm:text-lg">
              {fact.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
