"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/features/dashboard/components/ProductForm";
import { ROUTES } from "@/constants/routes";
import type { CreateProductInput } from "@/store/api/types";
import {
  useAdminCreateProductMutation,
  useAdminListCategoriesQuery,
} from "@/store/slices";

export function ProductCreatePage() {
  const router = useRouter();
  const { data: categoriesData, isLoading: loadingCategories } =
    useAdminListCategoriesQuery({ page: 1, limit: 50 });
  const [createProduct, { isLoading }] = useAdminCreateProductMutation();
  const categories = categoriesData?.items ?? [];

  async function handleSubmit(body: CreateProductInput) {
    await createProduct(body).unwrap();
    router.push(ROUTES.dashboardProducts);
    router.refresh();
  }

  if (loadingCategories) {
    return (
      <p className="py-16 text-center text-sm text-[#8a7a6c]">
        Loading form…
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          href={ROUTES.dashboardProducts}
          className="text-xs font-medium text-[#c4a574] hover:text-[#2a1f16]"
        >
          ← Back to products
        </Link>
        <h2 className="mt-3 font-serif text-2xl font-medium text-[#2a1f16]">
          Add product
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Storefront only shows active products.
        </p>
      </div>
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-[#e8ddd2] bg-white px-5 py-8 text-center">
          <p className="text-sm text-[#7a6b5d]">
            Create a category before adding products.
          </p>
          <Link
            href={ROUTES.dashboardCategoryNew}
            className="mt-3 inline-block text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
          >
            Add category
          </Link>
        </div>
      ) : (
        <ProductForm
          categories={categories}
          saving={isLoading}
          onCancel={() => router.push(ROUTES.dashboardProducts)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
