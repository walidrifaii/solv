import { baseApi } from "@/store/api/baseApi";

export type AdminUploadResult = {
  path: string;
  url: string;
  category: string;
};

export const adminUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminUploadImage: builder.mutation<AdminUploadResult, FormData>({
      query: (body) => ({
        url: "/admin/upload",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAdminUploadImageMutation } = adminUploadApi;
