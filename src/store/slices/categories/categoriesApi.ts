import { baseApi } from "@/store/api/baseApi";
import type { ApiCategory, PaginationParams } from "@/store/api/types";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiCategory[], PaginationParams | void>({
      query: (params) => ({
        url: "/categories",
        params: params ?? {},
      }),
      providesTags: ["Categories"],
    }),

    getCategoryById: builder.query<ApiCategory, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Categories", id }],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryByIdQuery } =
  categoriesApi;
