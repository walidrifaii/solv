import type { ApiFailure } from "@/store/api/types";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === "object" && data !== null && "error" in data) {
      const message = (data as ApiFailure).error?.message;
      if (message) return message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
