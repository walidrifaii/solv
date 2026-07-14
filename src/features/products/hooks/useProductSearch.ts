"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";

export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalized),
    );
  }, [products, query]);

  return { query, setQuery, results };
}
