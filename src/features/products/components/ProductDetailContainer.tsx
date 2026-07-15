"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ProductDetailView } from "@/features/products/components/ProductDetailView";
import { mapApiProductToShop } from "@/store/mappers/product";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "@/store/slices";

type ProductDetailContainerProps = {
  slug: string;
};

export function ProductDetailContainer({ slug }: ProductDetailContainerProps) {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductBySlugQuery(slug);

  const { data: relatedRaw } = useGetProductsQuery(
    {
      categoryId: product?.categoryId,
      limit: 8,
    },
    { skip: !product?.categoryId },
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
        Loading product…
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#FEF9F6] px-4 py-24 text-center">
        <p className="font-serif text-2xl text-[#2a1f16]">Product not found</p>
        <Link
          href={ROUTES.shop}
          className="mt-4 text-sm text-[#c4a574] underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const shopProduct = mapApiProductToShop(product);
  const related = (relatedRaw ?? [])
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4)
    .map(mapApiProductToShop);

  return <ProductDetailView product={shopProduct} related={related} />;
}
