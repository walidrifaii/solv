import { baseApi } from "@/store/api/baseApi";

export type ApiAdmin = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type AdminAuthResponse = { admin: ApiAdmin };

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMe: builder.query<ApiAdmin, void>({
      query: () => "/admin/auth/me",
      transformResponse: (res: AdminAuthResponse) => res.admin,
      providesTags: ["AdminMe"],
    }),

    adminLogin: builder.mutation<
      ApiAdmin,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/admin/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (res: AdminAuthResponse) => res.admin,
      invalidatesTags: ["AdminMe"],
    }),

    adminLogout: builder.mutation<{ loggedOut: boolean }, void>({
      query: () => ({
        url: "/admin/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["AdminMe"],
    }),

    adminRefresh: builder.mutation<ApiAdmin, void>({
      query: () => ({
        url: "/admin/auth/refresh",
        method: "POST",
      }),
      transformResponse: (res: AdminAuthResponse) => res.admin,
      invalidatesTags: ["AdminMe"],
    }),

    adminRequestPasswordChange: builder.mutation<
      { email: string; message: string },
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: "/admin/auth/password/request",
        method: "POST",
        body,
      }),
    }),

    adminConfirmPasswordChange: builder.mutation<
      { updated: boolean },
      { code: string }
    >({
      query: (body) => ({
        url: "/admin/auth/password/confirm",
        method: "POST",
        body,
      }),
    }),

    adminResendPasswordChangeOtp: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/admin/auth/password/resend",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetAdminMeQuery,
  useLazyGetAdminMeQuery,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRefreshMutation,
  useAdminRequestPasswordChangeMutation,
  useAdminConfirmPasswordChangeMutation,
  useAdminResendPasswordChangeOtpMutation,
} = adminAuthApi;
