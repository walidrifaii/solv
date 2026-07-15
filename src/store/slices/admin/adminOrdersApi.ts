import { baseApi } from "@/store/api/baseApi";
import type {
  AdminOrderListParams,
  ApiAdminOrder,
  ApiAdminOrderSummary,
  OrderStatus,
  Paginated,
} from "@/store/api/types";

function toQuery(params?: AdminOrderListParams) {
  if (!params) return {};
  return {
    ...(params.page != null ? { page: String(params.page) } : {}),
    ...(params.limit != null ? { limit: String(params.limit) } : {}),
    ...(params.search ? { search: params.search } : {}),
    ...(params.status ? { status: params.status } : {}),
  };
}

export const adminOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListOrders: builder.query<
      Paginated<ApiAdminOrderSummary>,
      AdminOrderListParams | void
    >({
      query: (params) => ({
        url: "/admin/orders",
        params: toQuery(params || undefined),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminOrders" as const,
                id,
              })),
              { type: "AdminOrders", id: "LIST" },
            ]
          : [{ type: "AdminOrders", id: "LIST" }],
    }),
    adminGetOrder: builder.query<ApiAdminOrder, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminOrders", id }],
    }),
    adminUpdateOrderStatus: builder.mutation<
      ApiAdminOrder,
      { id: string; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminOrders", id },
        { type: "AdminOrders", id: "LIST" },
        "Orders",
        "Products",
      ],
    }),
  }),
});

export const {
  useAdminListOrdersQuery,
  useAdminGetOrderQuery,
  useLazyAdminGetOrderQuery,
  useAdminUpdateOrderStatusMutation,
} = adminOrdersApi;
