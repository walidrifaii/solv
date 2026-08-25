import { baseApi } from "@/store/api/baseApi";
import type { ApiPromoBanner, PaginationParams } from "@/store/api/types";

export const promoBannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromoBanners: builder.query<ApiPromoBanner[], PaginationParams | void>({
      query: (params) => ({
        url: "/banners",
        params: params ?? {},
      }),
      providesTags: ["PromoBanners"],
    }),
  }),
});

export const { useGetPromoBannersQuery } = promoBannersApi;
