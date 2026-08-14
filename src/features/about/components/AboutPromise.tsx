import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import promiseImage from "@/assets/images/quality-showcase.png";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { aboutPromise } from "@/features/about/data";

export async function AboutPromise() {
  const t = await getTranslations("about.promise");

  return (
    <section className="relative isolate min-h-[18rem] overflow-hidden bg-[#a5a196] text-white sm:min-h-[20rem] md:min-h-[22rem] lg:min-h-[24rem]">
      <Image
        src={promiseImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[70%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#a5a196]/92 via-[#a5a196]/55 to-[#a5a196]/25" />

      <div className="relative z-10 mx-auto flex min-h-[18rem] w-full max-w-[1400px] items-center px-4 py-10 sm:min-h-[20rem] sm:px-6 sm:py-12 md:min-h-[22rem] md:px-8 md:py-14 lg:min-h-[24rem] lg:px-10">
        <div className="max-w-xl md:max-w-2xl">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#C9A962] uppercase sm:mb-4 sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-2xl leading-[1.12] font-medium text-white sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base">
            {t("description")}
          </p>
          <Link
            href={aboutPromise.cta.href}
-white transition-colors hover:bg-[#D9BC82] sm:mt-8 sm:px-6 sm:py-3 sm:text-base"
          >
            {t("cta")}
            <ArrowRightIcon className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
