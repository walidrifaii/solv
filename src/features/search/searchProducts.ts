import productsJson from "@/data/products.json";

export type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
};

export const searchProducts = productsJson as SearchProduct[];

export function searchLocalProducts(query: string, limit = 8): SearchProduct[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = normalized.split(/\s+/).filter(Boolean);

  const scored = searchProducts
    .map((product) => {
      const haystack = [
        product.name,
        product.subtitle,
        product.description,
        product.categoryLabel,
        product.categoryId,
        ...product.keywords,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (product.name.toLowerCase().includes(term)) score += 8;
        if (product.subtitle.toLowerCase().includes(term)) score += 4;
        if (product.categoryLabel.toLowerCase().includes(term)) score += 3;
        if (product.keywords.some((keyword) => keyword.includes(term))) score += 5;
        if (haystack.includes(term)) score += 1;
      }

      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  return scored.slice(0, limit).map((entry) => entry.product);
}
