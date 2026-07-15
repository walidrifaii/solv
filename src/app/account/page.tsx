import { Suspense } from "react";
import { AccountView } from "@/features/auth/components/AccountView";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
          Loading account…
        </div>
      }
    >
      <AccountView />
    </Suspense>
  );
}
