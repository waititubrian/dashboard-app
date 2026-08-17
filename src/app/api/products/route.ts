import { NextResponse } from "next/server";

import {
  createProduct,
  getProducts,
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

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(
      products.map(serializeProduct)
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch products.",
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

    const name =
      typeof body.name === "string"
        ? body.name
        : "";

    const description =
      typeof body.description === "string"
        ? body.description
        : null;

    const price = Number(body.price);
    const stock = Number(body.stock);

    const active =
      typeof body.active === "boolean"
        ? body.active
        : true;

    if (!Number.isFinite(price)) {
      return NextResponse.json(
        { error: "Price must be a valid number." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Stock must be a whole number." },
        { status: 400 }
      );
    }

    const product = await createProduct(
      name,
      description,
      price,
      stock,
      active
    );

    return NextResponse.json(
      serializeProduct(product),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create product.",
      },
      {
        status: 400,
      }
    );
  }
}