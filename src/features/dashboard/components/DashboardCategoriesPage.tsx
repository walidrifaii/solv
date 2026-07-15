import { dashboardMock } from "@/features/dashboard/data";

export function DashboardCategoriesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
          Categories
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Collection structure used on the home shop-by-category section.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardMock.categoriesPreview.map((category) => (
          <article
            key={category.name}
            className="rounded-2xl border border-[#e8ddd2] bg-white px-5 py-5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-medium text-[#2a1f16]">
                {category.name}
              </h3>
              <span className="rounded-full bg-[#e8f0e4] px-2.5 py-1 text-[11px] font-medium text-[#4f6b45]">
                Active
              </span>
            </div>
            <p className="mt-3 text-sm text-[#7a6b5d]">
              {category.products} products
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
