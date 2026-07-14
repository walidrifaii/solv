import Image from "next/image";
import Link from "next/link";
import { BagIcon } from "@/components/icons/BagIcon";
import {
  formatPrice,
  productPath,
} from "@/features/products/data/catalog";
import type { ShopProduct } from "@/types/product";

type ShopProductCardProps = {
  product: ShopProduct;
  className?: string;
};

export function ShopProductCard({
  product,
  className = "",
}: ShopProductCardProps) {
  const href = productPath(product.slug);
  const hasSale =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#efe4da] bg-[#F6EDE6] transition-shadow duration-300 hover:shadow-[0_12px_28px_rgba(42,31,22,0.08)] ${className}`}
    >
      <Link
        href={href}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#E7DDD2]"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.badges?.[0] ? (
          <span className="absolute top-3 left-3 rounded-md bg-[#17100a]/85 px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
            {product.badges[0]}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-4 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5">
        <p className="text-[10px] font-medium tracking-[0.16em] text-[#b0895b] uppercase">
          {product.categoryLabel}
        </p>
        <Link href={href} className="mt-1 block">
          <h3 className="text-[15px] leading-snug font-semibold text-[#1a120c] transition-colors group-hover:text-[#2a1f16] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-[#8a7a6c]">{product.subtitle}</p>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {hasSale ? (
              <p className="text-xs text-[#a39486] line-through">
                {product.currency} {product.originalPrice!.toFixed(2)}
              </p>
            ) : null}
            <p className="text-sm font-semibold text-[#c4a574] sm:text-base">
              {formatPrice(product)}
            </p>
          </div>
          <Link
            href={href}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[#2a1f16] text-white transition-colors hover:bg-[#3d2e22] sm:size-10"
            aria-label={`View ${product.name}`}
          >
            <BagIcon className="size-4 sm:size-[1.125rem]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
