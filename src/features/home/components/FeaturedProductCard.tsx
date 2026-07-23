"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("common");
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
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[#E7DDD2] sm:aspect-[4/4.5] md:aspect-square"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1200px) 30vw, 280px"
          className="object-cover object-center"
        />
      </Link>

      <div className="flex flex-1 flex-col bg-[#F6EDE6] px-3 pt-2.5 pb-3 sm:px-4 sm:pt-3 sm:pb-3.5">
        <Link href={href} className="block">
          <h3 className="truncate text-sm leading-snug font-semibold text-[#1a120c] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-[#8a7a6c] sm:text-sm">
            {product.subtitle}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:pt-2.5">
          <p className="text-sm font-semibold whitespace-nowrap text-[#c4a574] sm:text-base">
            {formatPrice(product)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#2a1f16] text-white transition-colors hover:bg-[#3d2e22] sm:size-9"
            aria-label={t("addToCart")}
          >
            <BagIcon className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
