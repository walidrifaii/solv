import { OrnamentIcon } from "@/components/icons/OrnamentIcon";
import { CategoryCardItem } from "@/features/home/components/CategoryCardItem";
import { CategorySlider } from "@/features/home/components/CategorySlider";
import { shopCategories } from "@/data/categories";

export function ShopByCategory() {
  return (
    <section className="bg-[#FEF9F6] px-4 py-14 text-[#2a1f16] sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 md:mb-14">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            Shop By Category
          </p>
          <h2 className="font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
            Explore Our Collection
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3 text-[#c4a574]">
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
            <OrnamentIcon className="size-3.5 sm:size-4" />
            <span className="h-px w-12 bg-[#c4a574]/70 sm:w-16" />
          </div>
        </div>

        <CategorySlider />

        <div className="hidden grid-cols-6 gap-5 lg:grid">
          {shopCategories.map((category) => (
            <CategoryCardItem key={category.id} category={category} className="h-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
