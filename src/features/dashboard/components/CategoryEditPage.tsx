"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/features/dashboard/components/CategoryForm";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import type { CreateCategoryInput } from "@/store/api/types";
import {
  useAdminGetCategoryQuery,
  useAdminUpdateCategoryMutation,
} from "@/store/slices";

export function CategoryEditPage({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAdminGetCategoryQuery(categoryId);
  const [updateCategory, { isLoading: saving }] =
    useAdminUpdateCategoryMutation();

  async function handleSubmit(body: CreateCategoryInput) {
    await updateCategory({ id: categoryId, body }).unwrap();
    router.push(ROUTES.dashboardCategories);
    router.refresh();
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-[#8a7a6c]">
        Loading category…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-sm text-[#a35d5d]">
          {getApiErrorMessage(error, "Category not found.")}
        </p>
        <Link
          href={ROUTES.dashboardCategories}
          className="text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
        >
          Back to categories
        </Link>
      </div>
    );
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
          Edit category
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Updating {data.name} ({data.id})
        </p>
      </div>
      <CategoryForm
        initial={data}
        saving={saving}
        onCancel={() => router.push(ROUTES.dashboardCategories)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
