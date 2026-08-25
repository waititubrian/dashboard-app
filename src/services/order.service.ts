import * as repository from "@/repositories/order.repository";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/types/order";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive whole number.");
  }
}

function validateStatus(status: OrderStatus) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid order status.");
  }
}

export async function createOrder(
  userId: number,
  productId: number,
  quantity: number,
  status: OrderStatus,
) {
  validateQuantity(quantity);
  validateStatus(status);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (!product.active) {
    throw new Error("Product is not active.");
  }

  if (product.stock < quantity) {
    throw new Error(
      `Insufficient stock. Only ${product.stock} item(s) available.`,
    );
  }

  const unitPrice = Number(product.price);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
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

    await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return order;
  });
}

export async function getOrders() {
  return repository.getOrders();
}

export async function getOrderById(id: number) {
  const order = await repository.getOrderById(id);

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
}

export async function updateOrder(
  id: number,
  userId: number,
  productId: number,
  quantity: number,
  status: OrderStatus,
) {
  validateQuantity(quantity);
  validateStatus(status);

  const existingOrder = await repository.getOrderById(id);

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (!product.active) {
    throw new Error("Product is not active.");
  }

  /*
   * Return the old quantity to stock first,
   * then check whether the new quantity is available.
   */
  const availableStock =
    product.stock +
    (existingOrder.productId === productId ? existingOrder.quantity : 0);

  if (availableStock < quantity) {
    throw new Error(
      `Insufficient stock. Only ${availableStock} item(s) available.`,
    );
  }

  const unitPrice = Number(product.price);

  return prisma.$transaction(async (tx) => {
    if (existingOrder.productId === productId) {
      const quantityDifference = quantity - existingOrder.quantity;

      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          stock: {
            decrement: quantityDifference,
          },
        },
      });
    } else {
      await tx.product.update({
        where: {
          id: existingOrder.productId,
        },
        data: {
          stock: {
            increment: existingOrder.quantity,
          },
        },
      });

      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });
    }

    return tx.order.update({
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
  });
}

export async function deleteOrder(id: number) {
  const existingOrder = await repository.getOrderById(id);

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  return prisma.$transaction(async (tx) => {
    /*
     * Return the ordered quantity to stock
     * when the order is deleted.
     */
    await tx.product.update({
      where: {
        id: existingOrder.productId,
      },
      data: {
        stock: {
          increment: existingOrder.quantity,
        },
      },
    });

    return tx.order.delete({
      where: {
        id,
      },
    });
  });
}
