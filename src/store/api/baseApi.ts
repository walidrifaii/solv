import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { ApiFailure, ApiSuccess } from "@/store/api/types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

/** Unwraps `{ success, data }` so slices stay simple (no transformResponse). */
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) return result;

  const body = result.data as ApiSuccess<unknown> | ApiFailure | undefined;

  if (body && typeof body === "object" && "success" in body) {
    if (body.success === false) {
      return {
        error: {
          status: result.meta?.response?.status ?? 400,
          data: body,
        },
      };
    }

    return { data: body.data };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Me",
    "AdminMe",
    "Products",
    "Categories",
    "AdminProducts",
    "AdminCategories",
    "Orders",
  ],
  endpoints: () => ({}),
});
