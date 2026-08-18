import { NextResponse } from "next/server";

import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/services/product.service";

function serializeProduct(product: {
  id: number;
  name: string;
  description: string | null;
  price: { toString(): string };
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...product,
    price: product.price.toString(),
  };
}

function parseId(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const productId = parseId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 },
      );
    }

    const product = await getProductById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch product." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const productId = parseId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 },
      );
    }

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const name = typeof body.name === "string" ? body.name : "";

    const description =
      typeof body.description === "string" ? body.description : null;

    const price = Number(body.price);
    const stock = Number(body.stock);

    const active = typeof body.active === "boolean" ? body.active : true;

    if (!Number.isFinite(price)) {
      return NextResponse.json(
        { error: "Price must be a valid number." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Stock must be a whole number." },
        { status: 400 },
      );
    }

    const product = await updateProduct(
      productId,
      name,
      description,
      price,
      stock,
      active,
    );

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update product.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const productId = parseId(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 },
      );
    }

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    await deleteProduct(productId);

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete product.",
      },
      {
        status: 500,
      },
    );
  }
}
