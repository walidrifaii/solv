import { baseApi } from "@/store/api/baseApi";
import type {
  AdminProductListParams,
  ApiAdminProduct,
  CreateProductInput,
  Paginated,
  UpdateProductInput,
} from "@/store/api/types";

function toQuery(params?: AdminProductListParams) {
  if (!params) return {};
  return {
    ...(params.page != null ? { page: String(params.page) } : {}),
    ...(params.limit != null ? { limit: String(params.limit) } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params.isActive !== undefined
      ? { isActive: String(params.isActive) }
      : {}),
    ...(params.featured !== undefined
      ? { featured: String(params.featured) }
      : {}),
    ...(params.inStock !== undefined
      ? { inStock: String(params.inStock) }
      : {}),
  };
}

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListProducts: builder.query<
      Paginated<ApiAdminProduct>,
      AdminProductListParams | void
    >({
      query: (params) => ({
        url: "/admin/products",
        params: toQuery(params || undefined),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminProducts" as const,
                id,
              })),
              { type: "AdminProducts", id: "LIST" },
            ]
          : [{ type: "AdminProducts", id: "LIST" }],
    }),
    adminGetProduct: builder.query<ApiAdminProduct, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminProducts", id }],
    }),
    adminCreateProduct: builder.mutation<ApiAdminProduct, CreateProductInput>({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AdminProducts", id: "LIST" },
        "Products",
      ],
    }),
    adminUpdateProduct: builder.mutation<
      ApiAdminProduct,
      { id: string; body: UpdateProductInput }
    >({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminProducts", id },
        { type: "AdminProducts", id: "LIST" },
        "Products",
      ],
    }),
    adminDeleteProduct: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AdminProducts", id: "LIST" },
        "Products",
      ],
    }),
  }),
});

export const {
  useAdminListProductsQuery,
  useAdminGetProductQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
} = adminProductsApi;
