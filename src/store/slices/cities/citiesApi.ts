import { baseApi } from "@/store/api/baseApi";
import type { ApiCity } from "@/store/api/types";

export const citiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<ApiCity[], void>({
      query: () => "/cities",
      providesTags: ["Cities"],
    }),
  }),
});

export const { useGetCitiesQuery } = citiesApi;
