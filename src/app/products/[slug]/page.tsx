import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/features/products/components/ProductDetailView";
import {
  getProductBySlug,
  getRelatedProducts,
  shopProducts,
} from "@/features/products/data/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product | Solv" };
  }
  return {
    title: `${product.name} | Solv`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <main className="flex flex-1 flex-col">
      <ProductDetailView product={product} related={related} />
    </main>
  );
}
