"use client";

import Link from "next/link";
import { ShopFilters } from "@/features/products/components/ShopFilters";
import { ShopGrid } from "@/features/products/components/ShopGrid";
import { ROUTES } from "@/constants/routes";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/store/slices";
import { mapApiProductToShop } from "@/store/mappers/product";

type ShopCatalogProps = {
  activeCategory: string;
};

export function ShopCatalog({ activeCategory }: ShopCatalogProps) {
  const categoryId =
    activeCategory === "all" ? undefined : activeCategory;

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery({
    categoryId,
    limit: 48,
    page: 1,
  });

  const { data: categoriesData } = useGetCategoriesQuery({ limit: 50 });

  const products = (productsData ?? []).map(mapApiProductToShop);
  const categories = [
    { id: "all", label: "All" },
    ...(categoriesData ?? []).map((category) => ({
      id: category.id,
      label: category.name,
    })),
  ];

  if (productsLoading) {
    return (
      <>
        <ShopFilters
          activeCategory={activeCategory}
          productCount={0}
          categories={categories}
        />
        <div className="bg-[#FEF9F6] px-4 py-20 text-center text-[#7a6b5d]">
          Loading products…
        </div>
      </>
    );
  }

  if (productsError) {
    return (
      <div className="bg-[#FEF9F6] px-4 py-20 text-center">
        <p className="font-serif text-2xl text-[#2a1f16]">
          Could not load products
        </p>
        <p className="mt-2 text-sm text-[#7a6b5d]">
          Check your connection or try again shortly.
        </p>
        <Link
          href={ROUTES.shop}
          className="mt-6 inline-block text-sm text-[#c4a574] underline"
        >
          Retry
        </Link>
      </div>
    );
  }

  return (
    <>
      <ShopFilters
        activeCategory={activeCategory}
        productCount={products.length}
        categories={categories}
      />
      <ShopGrid products={products} />
    </>
  );
}
