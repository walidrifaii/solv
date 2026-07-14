import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { shopProductCategories } from "@/features/products/data/catalog";

type ShopFiltersProps = {
  activeCategory: string;
};

export function ShopFilters({ activeCategory }: ShopFiltersProps) {
  return (
    <div className="bg-[#FEF9F6] px-4 pb-8 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="list"
          aria-label="Product categories"
        >
          {shopProductCategories.map((category) => {
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
      </div>
    </div>
  );
}
