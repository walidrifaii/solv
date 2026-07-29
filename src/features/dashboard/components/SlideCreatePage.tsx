"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlideForm } from "@/features/dashboard/components/SlideForm";
import { ROUTES } from "@/constants/routes";
import type { CreateSlideInput } from "@/store/api/types";
import { useAdminCreateSlideMutation } from "@/store/slices";

export function SlideCreatePage() {
  const router = useRouter();
  const [createSlide, { isLoading }] = useAdminCreateSlideMutation();

  async function handleSubmit(body: CreateSlideInput) {
    await createSlide(body).unwrap();
    router.push(ROUTES.dashboardSlides);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href={ROUTES.dashboardSlides}
          className="text-xs font-medium text-[#a5a196] hover:text-[#2a1f16]"
        >
          ← Back to slides
        </Link>
        <h2 className="mt-3 font-serif text-2xl font-medium text-[#2a1f16]">
          Add slide
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Shown on the homepage hero when active.
        </p>
      </div>
      <SlideForm
        saving={isLoading}
        onCancel={() => router.push(ROUTES.dashboardSlides)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
