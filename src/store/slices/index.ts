/** Import every API slice so endpoints are injected into baseApi. */
import "@/store/slices/auth/authApi";
import "@/store/slices/products/productsApi";
import "@/store/slices/categories/categoriesApi";
import "@/store/slices/orders/ordersApi";
import "@/store/slices/subscribers/subscribersApi";

export { baseApi } from "@/store/api/baseApi";

export {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
} from "@/store/slices/auth/authApi";

export {
  useGetProductsQuery,
  useGetProductBySlugQuery,
} from "@/store/slices/products/productsApi";

export {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} from "@/store/slices/categories/categoriesApi";

export {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
} from "@/store/slices/orders/ordersApi";

export { useSubscribeMutation } from "@/store/slices/subscribers/subscribersApi";
