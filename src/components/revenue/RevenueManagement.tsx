"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Spinner from "@/components/ui/spinner";

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

  async function loadRevenue() {
    setLoading(true);

    try {
      const response = await fetch("/api/revenue");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load revenue.");
      }

      setData(result);
    } catch (error) {
      console.error(error);

      toast.error(
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

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Revenue</h1>

        <p className="mt-2 text-muted-foreground">
          Revenue generated from completed orders.
        </p>
      </div>

      <RevenueStats
        totalRevenue={data.summary.totalRevenue}
        totalOrders={data.summary.totalOrders}
        averageOrderValue={data.summary.averageOrderValue}
      />

      <Card className="mb-8">
        <CardContent>
          <h2 className="mb-6 text-xl font-semibold">Revenue by Product</h2>

          {data.products.length === 0 ? (
            <p className="text-muted-foreground">No revenue data available.</p>
          ) : (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">
                      Quantity Sold
                    </TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.products.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>{product.productName}</TableCell>

                      <TableCell className="text-center">
                        {product.totalQuantity}
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        KSh {product.totalRevenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="mb-6 text-xl font-semibold">Completed Orders</h2>

          <RevenueTable orders={data.orders} />
        </CardContent>
      </Card>
    </div>
  );
}
