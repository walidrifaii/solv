import { baseApi } from "@/store/api/baseApi";
import type { ApiClient } from "@/store/api/types";

type AuthClientResponse = { client: ApiClient };

type RegisterResponse = {
  requiresVerification: true;
  channel: string;
  otpToken: string;
  expiresIn: number;
  phone: string;
  phoneMasked: string;
  message: string;
};

type ResendPhoneResponse = {
  phone: string;
  phoneMasked: string;
  channel: string;
  otpToken: string;
  expiresIn: number;
  message: string;
};

type ForgotPasswordResponse = {
  ok: true;
  channel: string;
  otpToken?: string;
  expiresIn?: number;
  phoneMasked?: string;
  email?: string;
  message: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ApiClient, void>({
      query: () => "/auth/me",
      transformResponse: (res: AuthClientResponse) => res.client,
      providesTags: ["Me"],
    }),

    login: builder.mutation<
      ApiClient,
      | { email: string; password: string }
      | { countryCode: string; phone: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (res: AuthClientResponse) => res.client,
      invalidatesTags: ["Me", "Orders"],
    }),

    register: builder.mutation<
      RegisterResponse,
      {
        name: string;
        password: string;
        countryCode: string;
        phone: string;
        countryId?: string;
        email?: string | null;
      }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<
      ApiClient,
      | { email: string; code: string }
      | {
          code: string;
          otpToken: string;
          countryCode?: string;
          phone?: string;
        }
    >({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      transformResponse: (res: AuthClientResponse) => res.client,
      invalidatesTags: ["Me", "Orders"],
    }),

    resendOtp: builder.mutation<
      | { email: string; message: string }
      | ResendPhoneResponse,
      | { email: string }
      | { countryCode: string; phone: string }
    >({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      | { email: string }
      | { countryCode: string; phone: string }
    >({
      query: (body) => ({
        url: "/auth/password/forgot",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      { updated: boolean; message: string },
      | { email: string; code: string; newPassword: string }
      | {
          code: string;
          newPassword: string;
          otpToken: string;
          countryCode?: string;
          phone?: string;
        }
    >({
      query: (body) => ({
        url: "/auth/password/reset",
        method: "POST",
        body,
      }),
    }),

    updateProfile: builder.mutation<
      ApiClient,
      { name?: string; phone?: string | null }
    >({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      transformResponse: (res: AuthClientResponse) => res.client,
      invalidatesTags: ["Me"],
    }),

    changePassword: builder.mutation<
      { updated: boolean },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/password",
        method: "PUT",
        body,
      }),
    }),

    requestEmailChange: builder.mutation<
      { pendingEmail: string; message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/auth/email/request",
        method: "POST",
        body,
      }),
    }),

    confirmEmailChange: builder.mutation<
      ApiClient,
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/auth/email/confirm",
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
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useRequestEmailChangeMutation,
  useConfirmEmailChangeMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
