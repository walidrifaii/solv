"use client";

import { useTranslations } from "next-intl";
import { CategoryProductStrip } from "@/features/home/components/CategoryProductStrip";

const CATEGORY_MATCHERS = [
  "specialty-coffee-crops",
  "specialty coffee crops",
  "محاصيل القهوة المختصة",
] as const;

export function SpecialtyCoffeeCrops() {
  const t = useTranslations("home.specialtyCoffeeCrops");

  return (
    <CategoryProductStrip
      matchers={CATEGORY_MATCHERS}
      fallbackTitle={t("title")}
      viewAllLabel={t("viewAll")}
      prevLabel={t("prev")}
      nextLabel={t("next")}
      sectionBgClass="bg-[#FEF9F6]"
    />
  );
}
