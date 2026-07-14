import Link from "next/link";
import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { ROUTES } from "@/constants/routes";
import { shopProductCategories } from "@/features/products/data/catalog";

type ShopHeaderProps = {
  activeCategory: string;
  productCount: number;
};

export function ShopHeader({ activeCategory, productCount }: ShopHeaderProps) {
  const activeLabel =
    shopProductCategories.find((item) => item.id === activeCategory)?.label ??
    "All";

  return (
    <section className="bg-[#FEF9F6] px-4 pt-10 pb-6 text-[#2a1f16] sm:px-6 sm:pt-12 sm:pb-8 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <nav className="mb-5 text-sm text-[#8a7a6c]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.home} className="transition-colors hover:text-[#2a1f16]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#2a1f16]">Shop</li>
          </ol>
        </nav>

        <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
          SOLV Collection
        </p>
        <h1 className="font-serif text-4xl leading-tight font-medium text-[#2a1f16] sm:text-5xl md:text-[3.25rem]">
          Shop
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
          Premium coffee, tea, accessories, and gift sets — curated for homes and
          hospitality across Qatar.
        </p>
        <div className="mt-5 flex items-center gap-3 text-[#c4a574]">
          <span className="h-px w-10 bg-[#c4a574]/70 sm:w-14" />
          <OrnamentIcon className="size-3.5" />
          <span className="h-px w-10 bg-[#c4a574]/70 sm:w-14" />
        </div>
        <p className="mt-5 text-sm text-[#8a7a6c]">
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
    </section>
  );
}
