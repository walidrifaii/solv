import type { Metadata } from "next";
import { ProductDetailContainer } from "@/features/products/components/ProductDetailContainer";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} | Solv`,
    description: "Premium coffee and tea from SOLV.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <main className="flex flex-1 flex-col">
      <ProductDetailContainer slug={slug} />
    </main>
  );
}
