/** Import every API slice so endpoints are injected into baseApi. */
import "@/store/slices/auth/authApi";
import "@/store/slices/admin/adminAuthApi";
import "@/store/slices/admin/adminCategoriesApi";
import "@/store/slices/admin/adminProductsApi";
import "@/store/slices/admin/adminUploadApi";
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
  useGetAdminMeQuery,
  useLazyGetAdminMeQuery,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRefreshMutation,
} from "@/store/slices/admin/adminAuthApi";

export {
  useAdminListCategoriesQuery,
  useAdminGetCategoryQuery,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
} from "@/store/slices/admin/adminCategoriesApi";

export {
  useAdminListProductsQuery,
  useAdminGetProductQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
} from "@/store/slices/admin/adminProductsApi";

export { useAdminUploadImageMutation } from "@/store/slices/admin/adminUploadApi";

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
