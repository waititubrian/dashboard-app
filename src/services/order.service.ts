import * as repository from "@/repositories/order.repository";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/types/order";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const TERMINAL_STATUSES: OrderStatus[] = ["CANCELLED", "REFUNDED"];

function holdsStock(status: OrderStatus) {
  return !TERMINAL_STATUSES.includes(status);
}

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

    // Only reserve stock for orders that aren't already
    // cancelled/refunded at creation time.
    if (holdsStock(status)) {
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
   * Stock is only "reserved" while an order is in a non-terminal
   * (not cancelled/refunded) status. Only add the order's current
   * reservation back into the availability count if it's actually
   * held right now, and only enforce availability if the update
   * would keep (or newly create) a reservation.
   */
  const wasHeld = holdsStock(existingOrder.status);
  const willBeHeld = holdsStock(status);

  const availableStock =
    product.stock +
    (wasHeld && existingOrder.productId === productId
      ? existingOrder.quantity
      : 0);

  if (willBeHeld && availableStock < quantity) {
    throw new Error(
      `Insufficient stock. Only ${availableStock} item(s) available.`,
    );
  }

  const unitPrice = Number(product.price);

  return prisma.$transaction(async (tx) => {
    if (wasHeld && !willBeHeld) {
      // Status is moving to cancelled/refunded: release the stock
      // that was reserved for this order.
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
    } else if (!wasHeld && willBeHeld) {
      // Status is moving out of cancelled/refunded: nothing is
      // currently reserved for this order, so reserve fresh.
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
    } else if (wasHeld && willBeHeld) {
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
    }
    // else (!wasHeld && !willBeHeld): no stock movement at all.

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
