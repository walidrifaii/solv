export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
};

export type ApiFailure = {
  success: false;
  error: { message: string; details?: unknown };
};

export type ApiClient = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
};

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imagePath: string;
  sortOrder: number;
  productCount?: number;
};

export type ApiProduct = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountType: "FIXED" | "PERCENTAGE" | null;
  discount: number | null;
  finalPrice: number;
  imagePath: string;
  quantity: number;
  inStock: boolean;
  isFeatured: boolean;
  sortOrder: number;
  category?: { id: string; slug: string; name: string };
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
