import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function isStalePrismaClient(client: PrismaClient) {
  const runtime = client as {
    admin?: unknown;
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name: string }> }>;
    };
  };

  // After schema changes, HMR can keep a stale singleton missing new models/fields.
  if (typeof runtime.admin === "undefined") return true;

  const orderItemFields = runtime._runtimeDataModel?.models?.OrderItem?.fields;
  if (
    Array.isArray(orderItemFields) &&
    !orderItemFields.some((field) => field.name === "imagePath")
  ) {
    return true;
  }

  return false;
}

function getPrismaClient() {
  const existing = globalForPrisma.prisma;
  if (existing && isStalePrismaClient(existing)) {
    void existing.$disconnect();
    globalForPrisma.prisma = undefined;
  }

  const client = globalForPrisma.prisma ?? createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/** Always resolves through getPrismaClient so schema HMR cannot leave a stale instance. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
