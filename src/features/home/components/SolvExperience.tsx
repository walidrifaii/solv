import { useTranslations } from "next-intl";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { experienceFeatures } from "@/features/home/data/experience";

export function SolvExperience() {
  const t = useTranslations("home.experience");

  return (
    <section className="bg-[#FEF9F6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
            {t("title")}
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#c4a574]">
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4">
          {experienceFeatures.map((feature) => {
            const { Icon } = feature;

            return (
              <article
                key={feature.id}
                className="flex h-full min-w-0 flex-col items-center rounded-2xl border border-[#efe4da] bg-[#F6EDE6] px-3 py-5 text-center shadow-[0_8px_24px_rgba(42,31,22,0.04)] sm:px-5 sm:py-6 md:px-6 md:py-7"
              >
                <Icon className="mb-3 size-9 text-[#c4a574] sm:mb-4 sm:size-11 md:size-12" />
                <h3 className="font-serif text-sm font-semibold text-[#2a1f16] sm:text-lg md:text-xl">
                  {t(`${feature.id}.title`)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#7a6b5d] sm:mt-2 sm:text-sm md:text-[15px]">
                  {t(`${feature.id}.description`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
