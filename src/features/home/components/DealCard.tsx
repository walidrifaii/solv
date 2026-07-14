import Image from "next/image";
import Link from "next/link";
import { BagIcon } from "@/components/icons/BagIcon";
import type { DealProduct } from "@/features/home/data/deals";

type DealCardProps = {
  product: DealProduct;
  className?: string;
};

export function DealCard({ product, className = "" }: DealCardProps) {
  return (
    <article
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${className}`}
    >
      <Image
        src={product.image}
        alt={product.imageAlt}
        fill
        sizes="(max-width: 768px) 82vw, 360px"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      <span className="absolute top-3 left-3 z-10 rounded-md bg-[#c43c3c] px-2 py-1 text-xs font-semibold text-white">
        -{product.discountPercent}%
      </span>

      <Link href={product.href} className="absolute inset-0 z-[1]" aria-label={product.name} />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-snug text-white sm:text-base">
            {product.name}
          </h3>
          <p className="mt-0.5 text-sm text-white/75">{product.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-xs text-white/45 line-through sm:text-sm">
              {product.currency} {product.originalPrice.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-white sm:text-base">
              {product.currency} {product.salePrice.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="relative z-20 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[#c4a574] text-white transition-colors hover:bg-[#d4b584] sm:size-10"
          aria-label={`Add ${product.name} to cart`}
        >
          <BagIcon className="size-4 sm:size-[1.125rem]" />
        </button>
      </div>
    </article>
  );
}
