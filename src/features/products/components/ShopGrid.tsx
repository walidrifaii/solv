import { ShopProductCard } from "@/features/products/components/ShopProductCard";
import type { ShopProduct } from "@/types/product";

type ShopGridProps = {
  products: ShopProduct[];
};

export function ShopGrid({ products }: ShopGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-[#FEF9F6] px-4 pb-16 text-center sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1400px] py-16">
          <p className="font-serif text-2xl text-[#2a1f16]">No products found</p>
          <p className="mt-2 text-sm text-[#7a6b5d]">
            Try another category to explore the collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#FEF9F6] px-4 pb-14 sm:px-6 sm:pb-16 md:px-8 lg:px-10 lg:pb-20">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
