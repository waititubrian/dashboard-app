import * as repository from "@/repositories/revenue.repository";

export async function getRevenueSummary() {
  const orders = await repository.getCompletedOrders();

  const totalRevenue = orders.reduce((total, order) => {
    return total + Number(order.unitPrice) * order.quantity;
  }, 0);

  const totalOrders = orders.length;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
  };
}

export async function getRevenueByOrder() {
  const orders = await repository.getCompletedOrders();

  return orders.map((order) => {
    const unitPrice = Number(order.unitPrice);

    return {
      orderId: order.id,

      customerName: order.user.name,

      productName: order.product.name,

      quantity: order.quantity,

      unitPrice,

      total: unitPrice * order.quantity,

      status: order.status,

      createdAt: order.createdAt.toISOString(),
    };
  });
}

export async function getRevenueByProduct() {
  const orders = await repository.getCompletedOrders();

  const productRevenue = new Map<
    number,
    {
      productId: number;
      productName: string;
      totalQuantity: number;
      totalRevenue: number;
    }
  >();

  for (const order of orders) {
    const existing = productRevenue.get(order.productId);

    const revenue = Number(order.unitPrice) * order.quantity;

    if (existing) {
      existing.totalQuantity += order.quantity;

      existing.totalRevenue += revenue;
    } else {
      productRevenue.set(order.productId, {
        productId: order.productId,

        productName: order.product.name,

        totalQuantity: order.quantity,

        totalRevenue: revenue,
      });
    }
  }

  return Array.from(productRevenue.values()).sort(
    (a, b) => b.totalRevenue - a.totalRevenue,
  );
}
