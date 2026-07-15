import {
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { ApiFailure, ApiSuccess } from "@/store/api/types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

type RawResult = Awaited<ReturnType<typeof rawBaseQuery>>;
type QueryResult = { data: unknown } | { error: FetchBaseQueryError };

function requestUrl(args: string | FetchArgs) {
  return typeof args === "string" ? args : args.url;
}

function shouldSkipReauth(url: string) {
  return (
    url.includes("/auth/refresh") ||
    url.includes("/admin/auth/refresh") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/verify-otp") ||
    url.includes("/auth/resend-otp") ||
    url.includes("/admin/auth/login") ||
    url.includes("/admin/auth/logout") ||
    url.includes("/auth/logout")
  );
}

function unwrapResult(result: RawResult): QueryResult {
  if (result.error) return { error: result.error };

  const body = result.data as ApiSuccess<unknown> | ApiFailure | undefined;

  if (body && typeof body === "object" && "success" in body) {
    if (body.success === false) {
      return {
        error: {
          status: result.meta?.response?.status ?? 400,
          data: body,
        },
      };
    }
    return { data: body.data };
  }

  return { data: result.data };
}

function isUnauthorized(result: QueryResult): result is { error: FetchBaseQueryError } {
  return "error" in result && result.error.status === 401;
}

type RefreshKind = "client" | "admin";

let clientRefreshPromise: Promise<boolean> | null = null;
let adminRefreshPromise: Promise<boolean> | null = null;

async function refreshSession(
  kind: RefreshKind,
  api: BaseQueryApi,
  extraOptions: Parameters<typeof rawBaseQuery>[2],
) {
  const run = async () => {
    const result = await rawBaseQuery(
      {
        url: kind === "admin" ? "/admin/auth/refresh" : "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (result.error) return false;

    const body = result.data as ApiSuccess<unknown> | ApiFailure | undefined;
    return Boolean(
      body &&
        typeof body === "object" &&
        "success" in body &&
        body.success === true,
    );
  };

  if (kind === "admin") {
    if (!adminRefreshPromise) {
      adminRefreshPromise = run().finally(() => {
        adminRefreshPromise = null;
      });
    }
    return adminRefreshPromise;
  }

  if (!clientRefreshPromise) {
    clientRefreshPromise = run().finally(() => {
      clientRefreshPromise = null;
    });
  }
  return clientRefreshPromise;
}

/** Unwraps `{ success, data }` and refreshes cookies once on 401. */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = unwrapResult(await rawBaseQuery(args, api, extraOptions));

  if (isUnauthorized(result) && !shouldSkipReauth(requestUrl(args))) {
    const kind: RefreshKind = requestUrl(args).startsWith("/admin")
      ? "admin"
      : "client";
    const refreshed = await refreshSession(kind, api, extraOptions);

    if (refreshed) {
      result = unwrapResult(await rawBaseQuery(args, api, extraOptions));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Me",
    "AdminMe",
    "Products",
    "Categories",
    "AdminProducts",
    "AdminCategories",
    "AdminOrders",
    "AdminDashboard",
    "Orders",
  ],
  endpoints: () => ({}),
});
