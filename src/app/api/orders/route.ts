import { NextResponse } from "next/server";

import {
  createOrder,
  getOrders,
} from "@/services/order.service";

import type { OrderStatus } from "@/types/order";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

function serializeOrder(order: any) {
  return {
    ...order,
    unitPrice: order.unitPrice.toString(),

    product: {
      ...order.product,
      price: order.product.price.toString(),
    },
  };
}

export async function GET() {
  try {
    const orders = await getOrders();

    return NextResponse.json(
      orders.map(serializeOrder)
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch orders.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);
    const productId = Number(body.productId);
    const quantity = Number(body.quantity);

    const status =
      typeof body.status === "string"
        ? body.status as OrderStatus
        : "PENDING";

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "Invalid product." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        {
          error:
            "Quantity must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const order = await createOrder(
      userId,
      productId,
      quantity,
      status
    );

    return NextResponse.json(
      serializeOrder(order),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create order.",
      },
      {
        status: 400,
      }
    );
  }
}