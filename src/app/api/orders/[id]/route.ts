import { NextResponse } from "next/server";

import {
  getOrderById,
  updateOrder,
  deleteOrder,
} from "@/services/order.service";

import type { OrderStatus } from "@/types/order";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

function parseId(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

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

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const orderId = parseId(id);

    if (!orderId) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);

    return NextResponse.json(
      serializeOrder(order)
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch order.",
      },
      {
        status: 404,
      }
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const orderId = parseId(id);

    if (!orderId) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

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

    const order = await updateOrder(
      orderId,
      userId,
      productId,
      quantity,
      status
    );

    return NextResponse.json(
      serializeOrder(order)
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update order.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const orderId = parseId(id);

    if (!orderId) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    await deleteOrder(orderId);

    return NextResponse.json({
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete order.",
      },
      {
        status: 400,
      }
    );
  }
}