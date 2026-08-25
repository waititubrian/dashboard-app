"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

import type { DashboardData } from "@/types/dashboard";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load dashboard.");
      }

      setData(result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
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
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-gray-400">Overview of your application.</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-400">Total Users</p>

          <p className="mt-2 text-3xl font-bold">{data.stats.totalUsers}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Total Products</p>

          <p className="mt-2 text-3xl font-bold">{data.stats.totalProducts}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Total Orders</p>

          <p className="mt-2 text-3xl font-bold">{data.stats.totalOrders}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Total Revenue</p>

          <p className="mt-2 text-3xl font-bold">
            KSh {data.stats.totalRevenue.toLocaleString()}
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Orders</h2>

            <p className="text-sm text-gray-400">Latest orders in the system</p>
          </div>

          <button
            onClick={loadDashboard}
            className="rounded border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800"
          >
            Refresh
          </button>
        </div>

        {data.recentOrders.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-700 px-4 py-3">Order</th>

                  <th className="border border-gray-700 px-4 py-3 text-left">
                    Customer
                  </th>

                  <th className="border border-gray-700 px-4 py-3 text-left">
                    Product
                  </th>

                  <th className="border border-gray-700 px-4 py-3">Quantity</th>

                  <th className="border border-gray-700 px-4 py-3">Total</th>

                  <th className="border border-gray-700 px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-700 px-4 py-3 text-center">
                      #{order.id}
                    </td>

                    <td className="border border-gray-700 px-4 py-3">
                      {order.customerName}
                    </td>

                    <td className="border border-gray-700 px-4 py-3">
                      {order.productName}
                    </td>

                    <td className="border border-gray-700 px-4 py-3 text-center">
                      {order.quantity}
                    </td>

                    <td className="border border-gray-700 px-4 py-3 text-right font-semibold">
                      KSh {order.total.toLocaleString()}
                    </td>

                    <td className="border border-gray-700 px-4 py-3 text-center">
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
