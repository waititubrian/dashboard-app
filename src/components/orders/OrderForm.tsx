"use client";

import { useEffect, useState } from "react";

import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Notification from "@/components/ui/Notification";

interface OrderFormProps {
  selectedOrder: Order | null;
  users: User[];
  products: Product[];
  onOrderSaved: (message: string) => void;
  onCancelEdit: () => void;
}

const statuses: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

export default function OrderForm({
  selectedOrder,
  users,
  products,
  onOrderSaved,
  onCancelEdit,
}: OrderFormProps) {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] =
    useState<OrderStatus>("PENDING");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedOrder) {
      setUserId(String(selectedOrder.userId));
      setProductId(String(selectedOrder.productId));
      setQuantity(String(selectedOrder.quantity));
      setStatus(selectedOrder.status);
    } else {
      setUserId("");
      setProductId("");
      setQuantity("");
      setStatus("PENDING");
    }

    setError("");
  }, [selectedOrder]);

  const selectedProduct = products.find(
    (product) =>
      product.id === Number(productId)
  );

  async function saveOrder() {
    setError("");

    const numericUserId = Number(userId);
    const numericProductId = Number(productId);
    const numericQuantity = Number(quantity);

    if (!numericUserId) {
      setError("Please select a customer.");
      return;
    }

    if (!numericProductId) {
      setError("Please select a product.");
      return;
    }

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      setError(
        "Quantity must be a positive whole number."
      );
      return;
    }

    setLoading(true);

    try {
      const isEditing = selectedOrder !== null;

      const response = await fetch(
        isEditing
          ? `/api/orders/${selectedOrder.id}`
          : "/api/orders",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: numericUserId,
            productId: numericProductId,
            quantity: numericQuantity,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save order."
        );
      }

      onCancelEdit();

      onOrderSaved(
        isEditing
          ? "Order updated successfully."
          : "Order created successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <h2 className="mb-6 text-xl font-semibold">
        {selectedOrder
          ? "Update Order"
          : "Create Order"}
      </h2>

      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <div className="grid gap-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Customer
          </label>

          <select
            value={userId}
            onChange={(event) =>
              setUserId(event.target.value)
            }
            className="w-full rounded border border-gray-600 bg-gray-900 p-3"
          >
            <option value="">
              Select customer
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name} — {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Product
          </label>

          <select
            value={productId}
            onChange={(event) =>
              setProductId(event.target.value)
            }
            className="w-full rounded border border-gray-600 bg-gray-900 p-3"
          >
            <option value="">
              Select product
            </option>

            {products
              .filter((product) => product.active)
              .map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — KSh{" "}
                  {Number(
                    product.price
                  ).toLocaleString()}
                </option>
              ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="rounded bg-gray-900 p-4 text-sm">
            <p>
              Current Price:{" "}
              <strong>
                KSh{" "}
                {Number(
                  selectedProduct.price
                ).toLocaleString()}
              </strong>
            </p>

            <p>
              Available Stock:{" "}
              <strong>
                {selectedProduct.stock}
              </strong>
            </p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            className="w-full rounded border border-gray-600 bg-gray-900 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as OrderStatus
              )
            }
            className="w-full rounded border border-gray-600 bg-gray-900 p-3"
          >
            {statuses.map((orderStatus) => (
              <option
                key={orderStatus}
                value={orderStatus}
              >
                {orderStatus}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            loading={loading}
            onClick={saveOrder}
          >
            {selectedOrder
              ? "Update Order"
              : "Create Order"}
          </Button>

          {selectedOrder && (
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}