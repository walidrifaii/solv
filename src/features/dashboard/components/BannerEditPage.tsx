"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PromoBannerForm } from "@/features/dashboard/components/PromoBannerForm";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import type { CreatePromoBannerInput } from "@/store/api/types";
import {
  useAdminGetPromoBannerQuery,
  useAdminUpdatePromoBannerMutation,
} from "@/store/slices";

export function BannerEditPage({ bannerId }: { bannerId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } =
    useAdminGetPromoBannerQuery(bannerId);
  const [updateBanner, { isLoading: saving }] =
    useAdminUpdatePromoBannerMutation();

  async function handleSubmit(body: CreatePromoBannerInput) {
    await updateBanner({ id: bannerId, body }).unwrap();
    router.push(ROUTES.dashboardBanners);
    router.refresh();
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-[#8a7a6c]">
        Loading banner…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-sm text-[#a35d5d]">
          {getApiErrorMessage(error, "Banner not found.")}
        </p>
        <Link
          href={ROUTES.dashboardBanners}
          className="text-sm font-medium text-[#C9A962] hover:text-[#a5a196]"
        >
          Back to banners
        </Link>
      </div>
    );
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
          Edit promo banner
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Banner image and category destination.
        </p>
      </div>
      <PromoBannerForm
        initial={data}
        saving={saving}
        onCancel={() => router.push(ROUTES.dashboardBanners)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
