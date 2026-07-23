"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">{t("somethingWentWrong")}</h2>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="rounded border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
