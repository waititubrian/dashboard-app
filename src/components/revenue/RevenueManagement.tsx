"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

import RevenueStats from "./RevenueStats";
import RevenueTable from "./RevenueTable";

import type {
  RevenueByOrder,
  RevenueByProduct,
  RevenueSummary,
} from "@/types/revenue";

interface RevenueResponse {
  summary: RevenueSummary;
  orders: RevenueByOrder[];
  products: RevenueByProduct[];
}

export default function RevenueManagement() {
  const [data, setData] = useState<RevenueResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadRevenue() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/revenue");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load revenue.");
      }

      setData(result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to load revenue.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRevenue();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <Notification
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Revenue</h1>

        <p className="mt-2 text-gray-400">
          Revenue generated from completed orders.
        </p>
      </div>

      <RevenueStats
        totalRevenue={data.summary.totalRevenue}
        totalOrders={data.summary.totalOrders}
        averageOrderValue={data.summary.averageOrderValue}
      />

      <Card className="mb-8">
        <h2 className="mb-6 text-xl font-semibold">Revenue by Product</h2>

        {data.products.length === 0 ? (
          <p className="text-gray-400">No revenue data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-700 px-4 py-3 text-left">
                    Product
                  </th>

                  <th className="border border-gray-700 px-4 py-3">
                    Quantity Sold
                  </th>

                  <th className="border border-gray-700 px-4 py-3">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {data.products.map((product) => (
                  <tr key={product.productId}>
                    <td className="border border-gray-700 px-4 py-3">
                      {product.productName}
                    </td>

                    <td className="border border-gray-700 px-4 py-3 text-center">
                      {product.totalQuantity}
                    </td>

                    <td className="border border-gray-700 px-4 py-3 text-right font-semibold">
                      KSh {product.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-6 text-xl font-semibold">Completed Orders</h2>

        <RevenueTable orders={data.orders} />
      </Card>
    </div>
  );
}
