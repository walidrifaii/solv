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

export type ApiAdminCategory = ApiCategory & {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export type ApiAdminProduct = ApiProduct & {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type AdminCategoryListParams = PaginationParams & {
  search?: string;
  isActive?: boolean;
};

export type AdminProductListParams = PaginationParams & {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  featured?: boolean;
  inStock?: boolean;
};

export type CreateCategoryInput = {
  id?: string;
  slug?: string;
  name: string;
  description?: string | null;
  imagePath?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateCategoryInput = Partial<
  Omit<CreateCategoryInput, "id">
>;

export type CreateProductInput = {
  id?: string;
  slug?: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountType?: "FIXED" | "PERCENTAGE" | null;
  discount?: number | null;
  imagePath: string;
  quantity?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
};

export type UpdateProductInput = Partial<Omit<CreateProductInput, "id">>;
