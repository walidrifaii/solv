"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PromoBannerForm } from "@/features/dashboard/components/PromoBannerForm";
import { ROUTES } from "@/constants/routes";
import type { CreatePromoBannerInput } from "@/store/api/types";
import { useAdminCreatePromoBannerMutation } from "@/store/slices";

export function BannerCreatePage() {
  const router = useRouter();
  const [createBanner, { isLoading }] = useAdminCreatePromoBannerMutation();

  async function handleSubmit(body: CreatePromoBannerInput) {
    await createBanner(body).unwrap();
    router.push(ROUTES.dashboardBanners);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href={ROUTES.dashboardBanners}
          className="text-xs font-medium text-[#C9A962] hover:text-[#a5a196]"
        >
          ← Back to banners
        </Link>
        <h2 className="mt-3 font-serif text-2xl font-medium text-[#a5a196]">
          Add promo banner
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Shown in the two-up section before Shop by Category when active.
        </p>
      </div>
      <PromoBannerForm
        saving={isLoading}
        onCancel={() => router.push(ROUTES.dashboardBanners)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
