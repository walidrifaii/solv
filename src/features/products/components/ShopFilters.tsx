import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { shopProductCategories } from "@/features/products/data/catalog";

type CategoryOption = { id: string; label: string };

type ShopFiltersProps = {
  activeCategory: string;
  productCount: number;
  categories?: readonly CategoryOption[];
};

export function ShopFilters({
  activeCategory,
  productCount,
  categories,
}: ShopFiltersProps) {
  const list = categories?.length
    ? categories
    : shopProductCategories.map((category) => ({
        id: category.id,
        label: category.label,
      }));

  const activeLabel =
    list.find((item) => item.id === activeCategory)?.label ?? "All";

  return (
    <div className="bg-[#FEF9F6] px-4 pb-8 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div
          className="no-scrollbar -mx-4 flex min-w-0 flex-1 gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="list"
          aria-label="Product categories"
        >
          {list.map((category) => {
            const href =
              category.id === "all"
                ? ROUTES.shop
                : `${ROUTES.shop}?category=${category.id}`;
            const isActive = activeCategory === category.id;

            return (
              <Link
                key={category.id}
                href={href}
                role="listitem"
                className={`shrink-0 rounded-md px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[#2a1f16] text-white"
                    : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
                }`}
              >
                {category.label}
              </Link>
            );
          })}
        </div>

        <p className="shrink-0 text-sm whitespace-nowrap text-[#8a7a6c] sm:text-right">
          Showing{" "}
          <span className="font-medium text-[#2a1f16]">{productCount}</span>{" "}
          {productCount === 1 ? "product" : "products"}
          {activeCategory !== "all" ? (
            <>
              {" "}
              in <span className="font-medium text-[#2a1f16]">{activeLabel}</span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
