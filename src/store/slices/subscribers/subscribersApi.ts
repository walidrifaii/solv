import { baseApi } from "@/store/api/baseApi";

export const subscribersApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    subscribe: builder.mutation<{ email: string }, { email: string }>({
      query: (body) => ({
        url: "/subscribers",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AdminSubscribers", id: "LIST" },
        "AdminDashboard",
      ],
    }),
  }),
});

export const { useSubscribeMutation } = subscribersApi;
