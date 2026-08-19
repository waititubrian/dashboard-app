"use client";

import { useEffect, useState } from "react";

import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

import OrderForm from "./OrderForm";
import OrderTable from "./OrderTable";

type NotificationState = {
  type: "success" | "error";
  message: string;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [orderToDelete, setOrderToDelete] =
    useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [notification, setNotification] =
    useState<NotificationState | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [
        ordersResponse,
        usersResponse,
        productsResponse,
      ] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/users"),
        fetch("/api/products"),
      ]);

      if (
        !ordersResponse.ok ||
        !usersResponse.ok ||
        !productsResponse.ok
      ) {
        throw new Error("Failed to load data.");
      }

      const [
        ordersData,
        usersData,
        productsData,
      ] = await Promise.all([
        ordersResponse.json(),
        usersResponse.json(),
        productsResponse.json(),
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error(error);

      setNotification({
        type: "error",
        message: "Unable to load order data.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderSaved(
    message: string
  ) {
    setSelectedOrder(null);

    setNotification({
      type: "success",
      message,
    });

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
      const response = await fetch(
        `/api/orders/${orderToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete order."
        );
      }

      setOrderToDelete(null);

      setNotification({
        type: "success",
        message:
          "Order deleted successfully.",
      });

      await loadData();
    } catch (error) {
      console.error(error);

      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete order.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Order Management
        </h1>

        <p className="mt-2 text-gray-400">
          Total Orders: {orders.length}
        </p>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() =>
            setNotification(null)
          }
        />
      )}

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

      <Modal
        isOpen={orderToDelete !== null}
        title="Delete Order"
        onClose={() => {
          if (!deleting) {
            setOrderToDelete(null);
          }
        }}
      >
        <p className="mb-6">
          Are you sure you want to delete order #
          {orderToDelete?.id}?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            disabled={deleting}
            onClick={() =>
              setOrderToDelete(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            loading={deleting}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}