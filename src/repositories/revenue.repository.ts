import { prisma } from "@/lib/prisma";

export async function getCompletedOrders() {
  return prisma.order.findMany({
    where: {
      status: "COMPLETED",
    },

    include: {
      user: true,
      product: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
