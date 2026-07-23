import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AccountView } from "@/features/auth/components/AccountView";

export default async function AccountPage() {
  const t = await getTranslations("account");

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
          {t("loading")}
        </div>
      }
    >
      <AccountView />
    </Suspense>
  );
}
