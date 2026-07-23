"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { BagIcon } from "@/components/icons/BagIcon";
import { useCart } from "@/features/cart/CartProvider";
import {
  productImageSrc,
  productPath,
} from "@/features/products/utils";
import type { ShopProduct } from "@/types/product";

type DealCardProps = {
  product: ShopProduct;
  className?: string;
};

function discountPercent(product: ShopProduct) {
  if (
    typeof product.originalPrice !== "number" ||
    product.originalPrice <= product.price
  ) {
    return 0;
  }
  return Math.round(
    (1 - product.price / product.originalPrice) * 100,
  );
}

export function DealCard({ product, className = "" }: DealCardProps) {
  const t = useTranslations("common");
  const { addItem } = useCart();
  const href = productPath(product.slug);
  const percent = discountPercent(product);

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
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${className}`}
    >
      <Image
        src={product.image}
        alt={product.imageAlt}
        fill
        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 33vw, 360px"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {percent > 0 ? (
        <span className="absolute top-3 start-3 z-10 rounded-md bg-[#c43c3c] px-2 py-1 text-xs font-semibold text-white">
          {t("off", { percent })}
        </span>
      ) : null}

      <Link href={href} className="absolute inset-0 z-[1]" aria-label={product.name} />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-2.5 sm:gap-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm leading-snug font-semibold text-white sm:text-base">
            {product.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-white/75 sm:text-sm">
            {product.subtitle}
          </p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 sm:mt-2 sm:gap-x-2">
            {product.originalPrice ? (
              <span className="text-[10px] text-white/45 line-through sm:text-sm">
                {product.currency} {product.originalPrice.toFixed(2)}
              </span>
            ) : null}
            <span className="text-xs font-semibold text-white sm:text-base">
              {product.currency} {product.price.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="relative z-20 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#c4a574] text-white transition-colors hover:bg-[#d4b584] sm:size-10"
          aria-label={t("addToCart")}
        >
          <BagIcon className="size-3.5 sm:size-[1.125rem]" />
        </button>
      </div>
    </article>
  );
}
