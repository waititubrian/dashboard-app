import { prisma } from "@/lib/prisma";

export async function getOrders() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: true,
      product: true,
    },
  });
}

export async function getOrderById(id: number) {
  return prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      user: true,
      product: true,
    },
  });
}
