import { getTranslations } from "next-intl/server";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { aboutValues } from "@/features/about/data";

export async function AboutValues() {
  const t = await getTranslations("about.values");

  return (
    <section className="bg-[#F6EDE6] px-4 py-12 text-[#2a1f16] sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {aboutValues.map((value, index) => {
            const { Icon } = value;
            const desktopDivider =
              index > 0 ? "lg:border-s lg:border-[#e0d2c4]" : "";
            const tabletDivider =
              index % 2 === 1
                ? "sm:border-s sm:border-[#e0d2c4] lg:border-s"
                : "";
            const mobileDivider =
              index > 0 ? "border-t border-[#e0d2c4] sm:border-t-0" : "";

            return (
              <div
                key={value.id}
                className={`flex flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-8 md:px-8 lg:py-4 ${mobileDivider} ${tabletDivider} ${desktopDivider}`}
              >
                <Icon className="mb-4 size-11 text-[#c4a574] sm:mb-5 sm:size-12" />
                <h3 className="font-serif text-lg font-semibold text-[#2a1f16] sm:text-xl">
                  {t(`${value.id}.title`)}
                </h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-[#7a6b5d] sm:mt-3 sm:text-[15px]">
                  {t(`${value.id}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
