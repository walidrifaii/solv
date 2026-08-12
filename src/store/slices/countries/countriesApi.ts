import { baseApi } from "@/store/api/baseApi";
import type { ApiCountry } from "@/store/api/types";

export const countriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<ApiCountry[], void>({
      query: () => "/countries",
      providesTags: ["Countries"],
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
