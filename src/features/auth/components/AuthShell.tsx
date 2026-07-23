import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import authImage from "@/assets/images/newsletter-community.png";
import { images } from "@/constants/images";
import { ROUTES } from "@/constants/routes";

type AuthShellProps = {
  children: ReactNode;
};

export async function AuthShell({ children }: AuthShellProps) {
  const t = await getTranslations("meta");
  const tNav = await getTranslations("nav");

  return (
    <section className="bg-[#FEF9F6] text-[#2a1f16]">
      <div className="mx-auto grid min-h-[calc(100svh-6rem)] w-full max-w-[1400px] lg:grid-cols-2">
        <div className="relative hidden min-h-full overflow-hidden lg:block">
          <Image
            src={authImage}
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17100a]/70 via-[#17100a]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="font-serif text-3xl font-medium tracking-[0.06em] text-white">
              SOLV
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-14 md:px-12 lg:px-16 lg:py-16">
          <Link href={ROUTES.home} className="mb-8 inline-flex w-fit lg:hidden">
            <Image
              src={images.logo}
              alt={tNav("logoAlt")}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          {children}
        </div>
      </div>
    </section>
  );
}
