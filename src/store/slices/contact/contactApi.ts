import { baseApi } from "@/store/api/baseApi";

export type ContactBody = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<{ sent: boolean; message: string }, ContactBody>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
