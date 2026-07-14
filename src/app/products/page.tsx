import type { Metadata } from "next";
import { ShopFilters } from "@/features/products/components/ShopFilters";
import { ShopGrid } from "@/features/products/components/ShopGrid";
import { ShopHeader } from "@/features/products/components/ShopHeader";
import {
  getProductsByCategory,
  shopProductCategories,
} from "@/features/products/data/catalog";

type ProductsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export const metadata: Metadata = {
  title: "Shop | Solv",
  description:
    "Shop SOLV premium coffee, tea, accessories, and gift sets — curated for homes and hospitality in Qatar.",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const requested = params.category ?? "all";
  const activeCategory = shopProductCategories.some(
    (category) => category.id === requested,
  )
    ? requested
    : "all";
  const products = getProductsByCategory(activeCategory);

  return (
    <main className="flex flex-1 flex-col">
      <ShopHeader activeCategory={activeCategory} productCount={products.length} />
      <ShopFilters activeCategory={activeCategory} />
      <ShopGrid products={products} />
    </main>
  );
}
