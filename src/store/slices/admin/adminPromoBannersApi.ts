import { baseApi } from "@/store/api/baseApi";
import type {
  AdminPromoBannerListParams,
  ApiAdminPromoBanner,
  CreatePromoBannerInput,
  Paginated,
  UpdatePromoBannerInput,
} from "@/store/api/types";

function toQuery(params?: AdminPromoBannerListParams) {
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

export const adminPromoBannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListPromoBanners: builder.query<
      Paginated<ApiAdminPromoBanner>,
      AdminPromoBannerListParams | void
    >({
      query: (params) => ({
        url: "/admin/banners",
        params: toQuery(params || undefined),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminPromoBanners" as const,
                id,
              })),
              { type: "AdminPromoBanners", id: "LIST" },
            ]
          : [{ type: "AdminPromoBanners", id: "LIST" }],
    }),
    adminGetPromoBanner: builder.query<ApiAdminPromoBanner, string>({
      query: (id) => `/admin/banners/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminPromoBanners", id }],
    }),
    adminCreatePromoBanner: builder.mutation<
      ApiAdminPromoBanner,
      CreatePromoBannerInput
    >({
      query: (body) => ({
        url: "/admin/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AdminPromoBanners", id: "LIST" },
        "PromoBanners",
      ],
    }),
    adminUpdatePromoBanner: builder.mutation<
      ApiAdminPromoBanner,
      { id: string; body: UpdatePromoBannerInput }
    >({
      query: ({ id, body }) => ({
        url: `/admin/banners/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminPromoBanners", id },
        { type: "AdminPromoBanners", id: "LIST" },
        "PromoBanners",
      ],
    }),
    adminDeletePromoBanner: builder.mutation<
      { id: string; deleted: boolean },
      string
    >({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AdminPromoBanners", id: "LIST" },
        "PromoBanners",
      ],
    }),
  }),
});

export const {
  useAdminListPromoBannersQuery,
  useAdminGetPromoBannerQuery,
  useAdminCreatePromoBannerMutation,
  useAdminUpdatePromoBannerMutation,
  useAdminDeletePromoBannerMutation,
} = adminPromoBannersApi;
