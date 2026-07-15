import { baseApi } from "@/store/api/baseApi";
import type { OrderStatus } from "@/store/api/types";

export type AdminDashboardStats = {
  ordersToday: number;
  ordersDelta: number;
  totalOrders: number;
  pendingOrders: number;
  revenueToday: number;
  lowStockCount: number;
  subscribers: number;
  lowStockThreshold: number;
};

export type AdminDashboardRecentOrder = {
  id: string;
  orderNumber: string;
  guestName: string;
  status: OrderStatus;
  total: number | null;
  deliveryCity: string;
  createdAt: string;
};

export type AdminDashboardLowStock = {
  id: string;
  name: string;
  imagePath: string;
  quantity: number;
  inStock: boolean;
  category: string;
};

export type AdminDashboardOverview = {
  stats: AdminDashboardStats;
  recentOrders: AdminDashboardRecentOrder[];
  lowStock: AdminDashboardLowStock[];
};

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminDashboardOverview: builder.query<AdminDashboardOverview, void>({
      query: () => "/admin/dashboard",
      providesTags: ["AdminDashboard"],
    }),
  }),
});

export const { useAdminDashboardOverviewQuery } = adminDashboardApi;
