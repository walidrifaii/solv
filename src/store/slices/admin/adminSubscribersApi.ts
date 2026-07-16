import { baseApi } from "@/store/api/baseApi";
import type { Paginated, PaginationParams } from "@/store/api/types";

export type ApiAdminSubscriber = {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
};

export type AdminSubscriberListParams = PaginationParams & {
  search?: string;
  isActive?: boolean;
};

function toQuery(params?: AdminSubscriberListParams) {
  if (!params) return {};
  return {
    ...(params.page != null ? { page: String(params.page) } : {}),
    ...(params.limit != null ? { limit: String(params.limit) } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.isActive !== undefined
      ? { isActive: String(params.isActive) }
      : {}),
  };
}

export const adminSubscribersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListSubscribers: builder.query<
      Paginated<ApiAdminSubscriber>,
      AdminSubscriberListParams | void
    >({
      query: (params) => ({
        url: "/admin/subscribers",
        params: toQuery(params || undefined),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminSubscribers" as const,
                id,
              })),
              { type: "AdminSubscribers", id: "LIST" },
            ]
          : [{ type: "AdminSubscribers", id: "LIST" }],
    }),
  }),
});

export const { useAdminListSubscribersQuery } = adminSubscribersApi;
