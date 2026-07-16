import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { ok } from "@/server/utils/http";
import { paginate, paginationMeta } from "@/server/utils/pagination";
import type { adminSubscriberListQuerySchema } from "@/server/validators/schemas";
import type { z } from "zod";

type ListQuery = z.infer<typeof adminSubscriberListQuerySchema>;

function mapSubscriber(row: {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
}) {
  return {
    id: row.id,
    email: row.email,
    isActive: row.isActive,
    subscribedAt: row.subscribedAt.toISOString(),
    unsubscribedAt: row.unsubscribedAt?.toISOString() ?? null,
  };
}

export async function adminListSubscribers(query: ListQuery) {
  const where: Prisma.SubscriberWhereInput = {
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.search
      ? { email: { contains: query.search } }
      : {}),
  };

  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.subscriber.count({ where }),
    prisma.subscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      skip,
      take,
    }),
  ]);

  return ok({
    items: rows.map(mapSubscriber),
    meta: paginationMeta(total, query.page, query.limit),
  });
}
