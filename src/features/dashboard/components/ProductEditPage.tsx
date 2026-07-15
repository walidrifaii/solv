"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/features/dashboard/components/ProductForm";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import type { CreateProductInput } from "@/store/api/types";
import {
  useAdminGetProductQuery,
  useAdminListCategoriesQuery,
  useAdminUpdateProductMutation,
} from "@/store/slices";

export function ProductEditPage({ productId }: { productId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAdminGetProductQuery(productId);
  const { data: categoriesData, isLoading: loadingCategories } =
    useAdminListCategoriesQuery({ page: 1, limit: 50 });
  const [updateProduct, { isLoading: saving }] =
    useAdminUpdateProductMutation();
  const categories = categoriesData?.items ?? [];

  async function handleSubmit(body: CreateProductInput) {
    await updateProduct({ id: productId, body }).unwrap();
    router.push(ROUTES.dashboardProducts);
    router.refresh();
  }

  if (isLoading || loadingCategories) {
    return (
      <p className="py-16 text-center text-sm text-[#8a7a6c]">
        Loading product…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-sm text-[#a35d5d]">
          {getApiErrorMessage(error, "Product not found.")}
        </p>
        <Link
          href={ROUTES.dashboardProducts}
          className="text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
        >
          Back to products
        </Link>
      </div>
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
          Edit product
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Updating {data.name} ({data.id})
        </p>
      </div>
      <ProductForm
        initial={data}
        categories={categories}
        saving={saving}
        onCancel={() => router.push(ROUTES.dashboardProducts)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
