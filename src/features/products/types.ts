import type { Product } from "@/types/product";

export type { Product };

export type ProductFilters = {
  categoryId?: string;
  query?: string;
};
