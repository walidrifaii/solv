import { dashboardMock } from "@/features/dashboard/data";

export function DashboardProductsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Products
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Read-only preview. Creating/editing products stays admin-only (UI
            only for now).
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Admin write API coming later"
          className="cursor-not-allowed rounded-xl bg-[#c4a574]/45 px-4 py-2.5 text-sm font-medium text-[#17100a]/70"
        >
          Add product
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {dashboardMock.productsPreview.map((product) => (
          <article
            key={product.name}
            className="rounded-2xl border border-[#e8ddd2] bg-white px-5 py-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-[#b0895b] uppercase">
                  {product.category}
                </p>
                <h3 className="mt-1 font-serif text-lg font-medium text-[#2a1f16]">
                  {product.name}
                </h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  product.active
                    ? "bg-[#e8f0e4] text-[#4f6b45]"
                    : "bg-[#f6e6e6] text-[#8a4545]"
                }`}
              >
                {product.active ? "Active" : "Hidden"}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-medium text-[#c4a574]">
                QAR {product.price.toFixed(2)}
              </span>
              <span className="text-[#7a6b5d]">Stock {product.stock}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
