import { baseApi } from "@/store/api/baseApi";
import type { PaginationParams } from "@/store/api/types";

export type ApiOrderItemSummary = {
  id: string;
  productName: string;
  quantity: number;
  total: number | null;
  imagePath: string | null;
};

export type ApiOrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number | null;
  deliveryFee: number | null;
  total: number | null;
  deliveryCity?: string;
  deliveryAddress?: string;
  createdAt: string;
  itemCount: number;
  items?: ApiOrderItemSummary[];
};

export type CreateOrderBody = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes?: string | null;
  deliveryFee?: number;
  items: { productId: string; quantity: number }[];
};

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<ApiOrderSummary[], PaginationParams | void>({
      query: (params) => ({
        url: "/orders",
        params: params ?? {},
      }),
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<unknown, CreateOrderBody>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders", "Products", "AdminOrders"],
    }),
  }),
});

export const { useGetMyOrdersQuery, useCreateOrderMutation } = ordersApi;
