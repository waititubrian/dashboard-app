import { prisma } from "@/lib/prisma";

export async function createOrder(
  userId: number,
  productId: number,
  quantity: number,
  unitPrice: number,
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED",
) {
  return prisma.order.create({
    data: {
      userId,
      productId,
      quantity,
      unitPrice,
      status,
    },

    include: {
      user: true,
      product: true,
    },
  });
}

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

export async function updateOrder(
  id: number,
  userId: number,
  productId: number,
  quantity: number,
  unitPrice: number,
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED",
) {
  return prisma.order.update({
    where: {
      id,
    },

    data: {
      userId,
      productId,
      quantity,
      unitPrice,
      status,
    },

    include: {
      user: true,
      product: true,
    },
  });
}

export async function deleteOrder(id: number) {
  return prisma.order.delete({
    where: {
      id,
    },
  });
}
