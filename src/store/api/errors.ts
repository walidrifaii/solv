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

export function getApiErrorDetails(error: unknown): Record<string, unknown> | null {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === "object" && data !== null && "error" in data) {
      const details = (data as ApiFailure).error?.details;
      if (details && typeof details === "object") {
        return details as Record<string, unknown>;
      }
    }
  }
  return null;
}

export function getApiErrorStatus(error: unknown): number | null {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status;
    return typeof status === "number" ? status : null;
  }
  return null;
}
