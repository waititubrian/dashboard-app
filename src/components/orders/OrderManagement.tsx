"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";

import OrderForm from "./OrderForm";
import OrderTable from "./OrderTable";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [ordersResponse, usersResponse, productsResponse] =
        await Promise.all([
          fetch("/api/orders"),
          fetch("/api/users"),
          fetch("/api/products"),
        ]);

      if (!ordersResponse.ok || !usersResponse.ok || !productsResponse.ok) {
        throw new Error("Failed to load data.");
      }

      const [ordersData, usersData, productsData] = await Promise.all([
        ordersResponse.json(),
        usersResponse.json(),
        productsResponse.json(),
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load order data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderSaved(message: string) {
    setSelectedOrder(null);

    toast.success(message);

    await loadData();
  }

  function editOrder(order: Order) {
    setSelectedOrder(order);
  }

  function cancelEdit() {
    setSelectedOrder(null);
  }

  function requestDelete(order: Order) {
    setOrderToDelete(order);
  }

  async function confirmDelete() {
    if (!orderToDelete) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/orders/${orderToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete order.");
      }

      setOrderToDelete(null);

      toast.success("Order deleted successfully.");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete order.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>

        <p className="mt-2 text-muted-foreground">
          Total Orders: {orders.length}
        </p>
      </div>

      <OrderForm
        selectedOrder={selectedOrder}
        users={users}
        products={products}
        onOrderSaved={handleOrderSaved}
        onCancelEdit={cancelEdit}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="large" />
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onEdit={editOrder}
          onDelete={requestDelete}
        />
      )}

      <Dialog
        open={orderToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setOrderToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">
            Are you sure you want to delete order #{orderToDelete?.id}?
          </p>

          <DialogFooter>
            <Button
              variant="secondary"
              disabled={deleting}
              onClick={() => setOrderToDelete(null)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
