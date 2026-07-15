import { prisma } from "@/lib/db";

export async function subscribeEmail(email: string) {
  const normalized = email.toLowerCase();
  const existing = await prisma.subscriber.findUnique({
    where: { email: normalized },
  });

  if (existing) {
    if (!existing.isActive) {
      const revived = await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });
      return {
        id: revived.id,
        email: revived.email,
        isActive: revived.isActive,
        subscribedAt: revived.subscribedAt.toISOString(),
      };
    }

    return {
      id: existing.id,
      email: existing.email,
      isActive: existing.isActive,
      subscribedAt: existing.subscribedAt.toISOString(),
    };
  }

  const created = await prisma.subscriber.create({
    data: { email: normalized },
  });

  return {
    id: created.id,
    email: created.email,
    isActive: created.isActive,
    subscribedAt: created.subscribedAt.toISOString(),
  };
}
