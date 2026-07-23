"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { BagIcon } from "@/components/icons/BagIcon";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/features/cart/CartProvider";
import {
  formatPrice,
  productPath,
} from "@/features/products/utils";
import type { ShopProduct } from "@/types/product";

type ProductDetailViewProps = {
  product: ShopProduct;
  related: ShopProduct[];
};

export function ProductDetailView({ product, related }: ProductDetailViewProps) {
  const t = useTranslations("shop.details");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const hasSale =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  function decrease() {
    setQuantity((value) => Math.max(1, value - 1));
    setAdded(false);
  }

  function increase() {
    setQuantity((value) => Math.min(20, value + 1));
    setAdded(false);
  }

  function handleAdd() {
    if (!product.inStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      imageSrc:
        typeof product.image === "string" ? product.image : product.image.src,
      imageAlt: product.imageAlt,
      quantity,
    });
    setAdded(true);
  }

  const fallbackDetails = [
    { label: t("category"), value: product.categoryLabel },
    {
      label: t("availability"),
      value: product.inStock ? tCommon("inStock") : tCommon("outOfStock"),
    },
  ];

  return (
    <div className="bg-[#FEF9F6] text-[#2a1f16]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-8 pb-14 sm:px-6 sm:pt-10 sm:pb-16 md:px-8 lg:px-10 lg:pb-20">
        <nav className="mb-8 text-sm text-[#8a7a6c]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.home} className="transition-colors hover:text-[#2a1f16]">
                {tNav("home")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={ROUTES.shop} className="transition-colors hover:text-[#2a1f16]">
                {tNav("shop")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`${ROUTES.shop}?category=${product.categoryId}`}
                className="transition-colors hover:text-[#2a1f16]"
              >
                {product.categoryLabel}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#2a1f16]">{product.name}</li>
          </ol>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#E7DDD2] sm:aspect-[5/4] lg:aspect-square">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.badges?.length ? (
              <div className="absolute top-4 start-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md bg-[#17100a]/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white uppercase"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="animate-[heroFade_0.55s_ease-out]">
            <p className="text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
              {product.categoryLabel}
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-tight font-medium text-[#2a1f16] sm:text-4xl md:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-[#8a7a6c] sm:text-base">{product.subtitle}</p>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              {hasSale ? (
                <span className="text-base text-[#a39486] line-through sm:text-lg">
                  {product.currency} {product.originalPrice!.toFixed(2)}
                </span>
              ) : null}
              <span className="font-serif text-3xl font-medium text-[#c4a574] sm:text-4xl">
                {formatPrice(product)}
              </span>
            </div>

            <p
              className={`mt-4 text-sm font-medium ${
                product.inStock ? "text-[#6f8f5a]" : "text-[#a35d5d]"
              }`}
            >
              {product.inStock ? tCommon("inStock") : tCommon("outOfStock")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center rounded-md border border-[#ddd0c4] bg-white">
                <button
                  type="button"
                  onClick={decrease}
                  className="px-3.5 py-2.5 text-lg leading-none text-[#2a1f16] transition-colors hover:bg-[#F6EDE6]"
                  aria-label={t("decreaseQuantity")}
                >
                  −
                </button>
                <span className="min-w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increase}
                  className="px-3.5 py-2.5 text-lg leading-none text-[#2a1f16] transition-colors hover:bg-[#F6EDE6]"
                  aria-label={t("increaseQuantity")}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8 sm:text-base"
              >
                <BagIcon className="size-4" />
                {tCommon("addToCart")}
              </button>
            </div>

            {added ? (
              <p className="mt-3 text-sm text-[#6f8f5a]" role="status">
                {t("added", { count: quantity })}
              </p>
            ) : null}

            <div className="mt-8 space-y-8 border-t border-[#e8ddd2] pt-6">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2a1f16] sm:text-2xl">
                  {t("about")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
                  {product.longDescription || product.description}
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl font-medium text-[#2a1f16] sm:text-2xl">
                  {t("heading")}
                </h2>
                <dl className="mt-3 divide-y divide-[#e8ddd2] border-y border-[#e8ddd2]">
                  {(product.details.length > 0
                    ? product.details
                    : fallbackDetails
                  ).map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <dt className="text-sm text-[#8a7a6c]">{detail.label}</dt>
                      <dd className="text-end text-sm font-medium text-[#2a1f16]">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {product.highlights.length > 0 ? (
                <ul className="space-y-2.5">
                  {product.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-[#5c4f43] sm:text-[15px]"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c4a574]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-[#e8ddd2] pt-12 sm:mt-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
                  {t("continueExploring")}
                </p>
                <h2 className="font-serif text-3xl font-medium text-[#2a1f16] sm:text-4xl">
                  {t("related")}
                </h2>
              </div>
              <Link
                href={ROUTES.shop}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2a1f16] transition-colors hover:text-[#c4a574]"
              >
                {tCommon("viewAll")}
                <ArrowRightIcon className="size-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <RelatedCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: ShopProduct }) {
  const href = productPath(product.slug);
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E7DDD2]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-3 text-[15px] font-semibold text-[#1a120c] group-hover:text-[#2a1f16]">
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-[#c4a574]">{formatPrice(product)}</p>
    </Link>
  );
}
