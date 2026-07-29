import { baseApi } from "@/store/api/baseApi";
import type { ApiHeroSlide, PaginationParams } from "@/store/api/types";

export const slidesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlides: builder.query<ApiHeroSlide[], PaginationParams | void>({
      query: (params) => ({
        url: "/slides",
        params: params ?? {},
      }),
      providesTags: ["Slides"],
    }),
  }),
});

export const { useGetSlidesQuery } = slidesApi;
