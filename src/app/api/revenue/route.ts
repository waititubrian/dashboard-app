import { NextResponse } from "next/server";

import {
  getRevenueSummary,
  getRevenueByOrder,
  getRevenueByProduct,
} from "@/services/revenue.service";

export async function GET() {
  try {
    const [summary, orders, products] = await Promise.all([
      getRevenueSummary(),
      getRevenueByOrder(),
      getRevenueByProduct(),
    ]);

    return NextResponse.json({
      summary,
      orders,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch revenue data.",
      },
      {
        status: 500,
      },
    );
  }
}
