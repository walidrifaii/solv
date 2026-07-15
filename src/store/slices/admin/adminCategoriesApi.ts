import { baseApi } from "@/store/api/baseApi";
import type {
  AdminCategoryListParams,
  ApiAdminCategory,
  CreateCategoryInput,
  Paginated,
  UpdateCategoryInput,
} from "@/store/api/types";

function toQuery(params?: AdminCategoryListParams) {
  if (!params) return {};
  return {
    ...(params.page != null ? { page: String(params.page) } : {}),
    ...(params.limit != null ? { limit: String(params.limit) } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.isActive !== undefined
      ? { isActive: String(params.isActive) }
      : {}),
  };
}

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListCategories: builder.query<
      Paginated<ApiAdminCategory>,
      AdminCategoryListParams | void
    >({
      query: (params) => ({
        url: "/admin/categories",
        params: toQuery(params || undefined),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminCategories" as const,
                id,
              })),
              { type: "AdminCategories", id: "LIST" },
            ]
          : [{ type: "AdminCategories", id: "LIST" }],
    }),
    adminGetCategory: builder.query<ApiAdminCategory, string>({
      query: (id) => `/admin/categories/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminCategories", id }],
    }),
    adminCreateCategory: builder.mutation<
      ApiAdminCategory,
      CreateCategoryInput
    >({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AdminCategories", id: "LIST" },
        "Categories",
      ],
    }),
    adminUpdateCategory: builder.mutation<
      ApiAdminCategory,
      { id: string; body: UpdateCategoryInput }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminCategories", id },
        { type: "AdminCategories", id: "LIST" },
        "Categories",
      ],
    }),
    adminDeleteCategory: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AdminCategories", id: "LIST" },
        "Categories",
      ],
    }),
  }),
});

export const {
  useAdminListCategoriesQuery,
  useAdminGetCategoryQuery,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
} = adminCategoriesApi;
