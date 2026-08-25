import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      completedOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.product.count(),

      prisma.order.count(),

      prisma.order.findMany({
        where: {
          status: "COMPLETED",
        },

        select: {
          quantity: true,
          unitPrice: true,
        },
      }),

      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 5,

        include: {
          user: true,
          product: true,
        },
      }),
    ]);

    const totalRevenue = completedOrders.reduce((total, order) => {
      return total + Number(order.unitPrice) * order.quantity;
    }, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },

      recentOrders: recentOrders.map((order) => ({
        id: order.id,

        customerName: order.user.name,

        productName: order.product.name,

        quantity: order.quantity,

        unitPrice: Number(order.unitPrice),

        total: Number(order.unitPrice) * order.quantity,

        status: order.status,

        createdAt: order.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard data.",
      },
      {
        status: 500,
      },
    );
  }
}
