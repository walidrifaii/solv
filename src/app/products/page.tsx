import type { Metadata } from "next";
import { ShopCatalog } from "@/features/products/components/ShopCatalog";
import { ShopHeader } from "@/features/products/components/ShopHeader";

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
  const activeCategory = params.category?.trim() || "all";

  return (
    <main className="flex flex-1 flex-col">
      <ShopHeader />
      <ShopCatalog activeCategory={activeCategory} />
    </main>
  );
}
