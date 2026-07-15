import { baseApi } from "@/store/api/baseApi";
import type { ApiClient } from "@/store/api/types";

type AuthClientResponse = { client: ApiClient };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ApiClient, void>({
      query: () => "/auth/me",
      transformResponse: (res: AuthClientResponse) => res.client,
      providesTags: ["Me"],
    }),

    login: builder.mutation<ApiClient, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (res: AuthClientResponse) => res.client,
      invalidatesTags: ["Me", "Orders"],
    }),

    register: builder.mutation<
      ApiClient,
      { name: string; email: string; password: string; phone?: string }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (res: AuthClientResponse) => res.client,
      invalidatesTags: ["Me"],
    }),

    logout: builder.mutation<{ loggedOut: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Me", "Orders"],
    }),

    refresh: builder.mutation<ApiClient, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      transformResponse: (res: AuthClientResponse) => res.client,
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
