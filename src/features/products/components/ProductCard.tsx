import Image from "next/image";
import Link from "next/link";
import { BagIcon } from "@/components/icons/BagIcon";
import {
  formatPrice,
  productPath,
} from "@/features/products/data/catalog";
import type { ShopProduct } from "@/types/product";

type ProductCardProps = {
  product: ShopProduct;
  className?: string;
};

/** @deprecated Prefer ShopProductCard — kept for compatibility */
export function ProductCard({ product, className = "" }: ProductCardProps) {
  const href = productPath(product.slug);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-[#efe4da] bg-[#F6EDE6] ${className}`}
    >
      <Link href={href} className="relative block aspect-[4/3] bg-[#E7DDD2]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </Link>
      <div className="flex flex-1 flex-col px-4 py-3">
        <Link href={href}>
          <h3 className="font-semibold text-[#1a120c]">{product.name}</h3>
          <p className="mt-1 text-sm text-[#8a7a6c]">{product.subtitle}</p>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-semibold text-[#c4a574]">{formatPrice(product)}</p>
          <BagIcon className="size-4 text-[#2a1f16]" />
        </div>
      </div>
    </article>
  );
}
