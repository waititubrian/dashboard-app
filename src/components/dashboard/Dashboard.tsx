"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Spinner from "@/components/ui/spinner";

import type { DashboardData } from "@/types/dashboard";

const statusBadgeVariant: Record<
  string,
  "default" | "outline" | "destructive" | "secondary"
> = {
  PENDING: "outline",
  COMPLETED: "default",
  CANCELLED: "destructive",
  REFUNDED: "secondary",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);

    try {
      const response = await fetch("/api/dashboard");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load dashboard.");
      }

      setData(result);
    } catch (error) {
      console.error(error);

      toast.error(
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

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Overview of your application.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="mt-2 text-3xl font-bold">{data.stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="mt-2 text-3xl font-bold">
              {data.stats.totalProducts}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="mt-2 text-3xl font-bold">{data.stats.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold">
              KSh {data.stats.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">
                Latest orders in the system
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={loadDashboard}>
              Refresh
            </Button>
          </div>

          {data.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No orders found.
            </p>
          ) : (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-center">
                        #{order.id}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell className="text-center">
                        {order.quantity}
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        KSh {order.total.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={statusBadgeVariant[order.status] ?? "outline"}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
