import { baseApi } from "@/store/api/baseApi";
import type { ApiProduct } from "@/store/api/types";

export type ProductsQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  featured?: boolean;
  inStock?: boolean;
};

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiProduct[], ProductsQuery | void>({
      query: (params) => ({
        url: "/products",
        params: params ?? {},
      }),
      providesTags: ["Products"],
    }),

    getProductBySlug: builder.query<ApiProduct, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (_result, _error, slug) => [
        { type: "Products", id: slug },
      ],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductBySlugQuery } = productsApi;
