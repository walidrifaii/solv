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
  emailVerified?: boolean;
  createdAt: string;
};

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
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
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  price: number;
  discountType: "FIXED" | "PERCENTAGE" | null;
  discount: number | null;
  finalPrice: number;
  imagePath: string;
  quantity: number;
  inStock: boolean;
  isFeatured: boolean;
  sortOrder: number;
  category?: {
    id: string;
    slug: string;
    name: string;
    nameAr: string | null;
  };
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
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
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
  nameAr?: string | null;
  description: string;
  descriptionAr?: string | null;
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

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type ApiAdminOrderItem = {
  id: string;
  productId: string | null;
  productSlug: string;
  productName: string;
  imagePath: string | null;
  unitPrice: number | null;
  discountType: "FIXED" | "PERCENTAGE" | null;
  discount: number | null;
  quantity: number;
  total: number | null;
};

export type ApiAdminOrderSummary = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number | null;
  deliveryFee: number | null;
  total: number | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes: string | null;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiAdminOrder = ApiAdminOrderSummary & {
  clientId: string | null;
  items: ApiAdminOrderItem[];
};

export type AdminOrderListParams = PaginationParams & {
  search?: string;
  status?: OrderStatus;
};
