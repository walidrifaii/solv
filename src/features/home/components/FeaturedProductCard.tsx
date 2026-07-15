"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BagIcon } from "@/components/icons/BagIcon";
import { useCart } from "@/features/cart/CartProvider";
import {
  formatPrice,
  productImageSrc,
  productPath,
} from "@/features/products/utils";
import type { ShopProduct } from "@/types/product";

type FeaturedProductCardProps = {
  product: ShopProduct;
  className?: string;
};

export function FeaturedProductCard({
  product,
  className = "",
}: FeaturedProductCardProps) {
  const { addItem } = useCart();
  const href = productPath(product.slug);

  function handleAdd(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      imageSrc: productImageSrc(product.image),
      imageAlt: product.imageAlt,
    });
  }

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-[#efe4da] bg-[#F6EDE6] shadow-[0_8px_24px_rgba(42,31,22,0.04)] ${className}`}
    >
      <Link
        href={href}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#E7DDD2]"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 78vw, (max-width: 1200px) 30vw, 280px"
          className="object-cover object-center"
        />
      </Link>

      <div className="flex flex-1 flex-col bg-[#F6EDE6] px-4 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5">
        <Link href={href} className="block">
          <h3 className="text-[15px] leading-snug font-semibold text-[#1a120c] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-[#8a7a6c]">{product.subtitle}</p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm font-semibold text-[#c4a574] sm:text-base">
            {formatPrice(product)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[#2a1f16] text-white transition-colors hover:bg-[#3d2e22] sm:size-10"
            aria-label={`Add ${product.name} to cart`}
          >
            <BagIcon className="size-4 sm:size-[1.125rem]" />
          </button>
        </div>
      </div>
    </article>
  );
}
