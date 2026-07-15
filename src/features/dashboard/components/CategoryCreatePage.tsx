"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/features/dashboard/components/CategoryForm";
import { ROUTES } from "@/constants/routes";
import type { CreateCategoryInput } from "@/store/api/types";
import { useAdminCreateCategoryMutation } from "@/store/slices";

export function CategoryCreatePage() {
  const router = useRouter();
  const [createCategory, { isLoading }] = useAdminCreateCategoryMutation();

  async function handleSubmit(body: CreateCategoryInput) {
    await createCategory(body).unwrap();
    router.push(ROUTES.dashboardCategories);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href={ROUTES.dashboardCategories}
          className="text-xs font-medium text-[#c4a574] hover:text-[#2a1f16]"
        >
          ← Back to categories
        </Link>
        <h2 className="mt-3 font-serif text-2xl font-medium text-[#2a1f16]">
          Add category
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Visible on the shop-by-category section when active.
        </p>
      </div>
      <CategoryForm
        saving={isLoading}
        onCancel={() => router.push(ROUTES.dashboardCategories)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
