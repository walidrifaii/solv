import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">{t("pageNotFound")}</h2>
      <Link href="/" className="text-sm underline underline-offset-4">
        {t("backHome")}
      </Link>
    </div>
  );
}
