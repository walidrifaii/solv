import { baseApi } from "@/store/api/baseApi";
import type {
  AdminSlideListParams,
  ApiAdminHeroSlide,
  CreateSlideInput,
  Paginated,
  UpdateSlideInput,
} from "@/store/api/types";

function toQuery(params?: AdminSlideListParams) {
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

export const adminSlidesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListSlides: builder.query<
      Paginated<ApiAdminHeroSlide>,
      AdminSlideListParams | void
    >({
      query: (params) => ({
        url: "/admin/slides",
        params: toQuery(params || undefined),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminSlides" as const,
                id,
              })),
              { type: "AdminSlides", id: "LIST" },
            ]
          : [{ type: "AdminSlides", id: "LIST" }],
    }),
    adminGetSlide: builder.query<ApiAdminHeroSlide, string>({
      query: (id) => `/admin/slides/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminSlides", id }],
    }),
    adminCreateSlide: builder.mutation<ApiAdminHeroSlide, CreateSlideInput>({
      query: (body) => ({
        url: "/admin/slides",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AdminSlides", id: "LIST" }, "Slides"],
    }),
    adminUpdateSlide: builder.mutation<
      ApiAdminHeroSlide,
      { id: string; body: UpdateSlideInput }
    >({
      query: ({ id, body }) => ({
        url: `/admin/slides/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminSlides", id },
        { type: "AdminSlides", id: "LIST" },
        "Slides",
      ],
    }),
    adminDeleteSlide: builder.mutation<{ id: string; deleted: boolean }, string>(
      {
        query: (id) => ({
          url: `/admin/slides/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "AdminSlides", id: "LIST" }, "Slides"],
      },
    ),
  }),
});

export const {
  useAdminListSlidesQuery,
  useAdminGetSlideQuery,
  useAdminCreateSlideMutation,
  useAdminUpdateSlideMutation,
  useAdminDeleteSlideMutation,
} = adminSlidesApi;
