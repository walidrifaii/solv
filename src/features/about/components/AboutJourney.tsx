import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { aboutJourney } from "@/features/about/data";

export function AboutJourney() {
  return (
    <section className="bg-[#FEF9F6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {aboutJourney.eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
            {aboutJourney.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
            {aboutJourney.description}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#c4a574]">
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
          </div>
        </div>

        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {aboutJourney.steps.map((step, index) => (
            <li key={step.id} className="relative">
              {index < aboutJourney.steps.length - 1 ? (
                <span
                  className="pointer-events-none absolute top-5 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] bg-[#c4a574]/35 lg:block"
                  aria-hidden
                />
              ) : null}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="font-serif text-3xl font-medium text-[#c4a574] sm:text-4xl">
                  {step.number}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-[#2a1f16]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-[#7a6b5d] sm:text-[15px]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
