"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlideForm } from "@/features/dashboard/components/SlideForm";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import type { CreateSlideInput } from "@/store/api/types";
import {
  useAdminGetSlideQuery,
  useAdminUpdateSlideMutation,
} from "@/store/slices";

export function SlideEditPage({ slideId }: { slideId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAdminGetSlideQuery(slideId);
  const [updateSlide, { isLoading: saving }] = useAdminUpdateSlideMutation();

  async function handleSubmit(body: CreateSlideInput) {
    await updateSlide({ id: slideId, body }).unwrap();
    router.push(ROUTES.dashboardSlides);
    router.refresh();
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-[#8a7a6c]">Loading slide…</p>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-sm text-[#a35d5d]">
          {getApiErrorMessage(error, "Slide not found.")}
        </p>
        <Link
          href={ROUTES.dashboardSlides}
          className="text-sm font-medium text-[#C9A962] hover:text-[#a5a196]"
        >
          Back to slides
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href={ROUTES.dashboardSlides}
          className="text-xs font-medium text-[#C9A962] hover:text-[#a5a196]"
        >
          ← Back to slides
        </Link>
        <h2 className="mt-3 font-serif text-2xl font-medium text-[#a5a196]">
          Edit slide
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Updating {data.title}
        </p>
      </div>
      <SlideForm
        initial={data}
        saving={saving}
        onCancel={() => router.push(ROUTES.dashboardSlides)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
