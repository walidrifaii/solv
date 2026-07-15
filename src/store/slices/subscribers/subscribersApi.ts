import { baseApi } from "@/store/api/baseApi";

export const subscribersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation<{ email: string }, { email: string }>({
      query: (body) => ({
        url: "/subscribers",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubscribeMutation } = subscribersApi;
