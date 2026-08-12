import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
};

export function ok<T>(
  data: T,
  init?: { status?: number; meta?: Record<string, unknown>; headers?: HeadersInit },
) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(init?.meta ? { meta: init.meta } : {}),
  };
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: init?.headers,
  });
}

export function fail(
  message: string,
  status = 400,
  details?: unknown,
) {
  const body: ApiFailure = {
    success: false,
    error: {
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return NextResponse.json(body, { status });
}

export function fromZod(error: ZodError) {
  return fail(
    "Validation failed",
    422,
    error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  );
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return fail(error.message, error.status, error.details);
  }
  if (error instanceof ZodError) {
    return fromZod(error);
  }

  const message =
    error instanceof Error ? error.message : String(error ?? "");
  if (
    message.includes("Can't reach database server") ||
    message.includes("P1001") ||
    message.includes("ECONNREFUSED")
  ) {
    console.error(error);
    return fail(
      "Database is unavailable. Start MySQL (XAMPP) and try again.",
      503,
    );
  }

  // Prisma known request errors
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";
  if (code === "P2021" || code === "P2022" || message.includes("does not exist")) {
    console.error(error);
    return fail(
      "Database schema is outdated. Redeploy so prisma db push can run.",
      503,
      { code: "schema_outdated" },
    );
  }
  if (code === "P2002") {
    console.error(error);
    return fail("This account already exists", 409, { code: "unique_constraint" });
  }
  if (code === "P2003") {
    console.error(error);
    return fail("Invalid country selection. Refresh the page and try again.", 400, {
      code: "foreign_key",
    });
  }

  console.error("[route-error]", error);
  return fail(
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : message || "Internal server error",
    500,
  );
}
