"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [status, setStatus] = useState<OrderStatus>("PENDING");

  const [loading, setLoading] = useState(false);

  /*
   * Reset the form to its initial state.
   */
  function resetForm() {
    setUserId("");
    setProductId("");
    setQuantity("");
    setStatus("PENDING");
  }

  /*
   * Populate the form when editing an existing order.
   * Clear the form when creating a new order.
   */
  useEffect(() => {
    if (selectedOrder) {
      setUserId(String(selectedOrder.userId));
      setProductId(String(selectedOrder.productId));
      setQuantity(String(selectedOrder.quantity));
      setStatus(selectedOrder.status);
    } else {
      resetForm();
    }
  }, [selectedOrder]);

  const selectedProduct = products.find(
    (product) => product.id === Number(productId),
  );

  async function saveOrder() {
    const numericUserId = Number(userId);
    const numericProductId = Number(productId);
    const numericQuantity = Number(quantity);

    if (!numericUserId) {
      toast.error("Please select a customer.");
      return;
    }

    if (!numericProductId) {
      toast.error("Please select a product.");
      return;
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
      toast.error("Quantity must be a positive whole number.");
      return;
    }

    setLoading(true);

    try {
      const isEditing = selectedOrder !== null;

      const response = await fetch(
        isEditing ? `/api/orders/${selectedOrder.id}` : "/api/orders",
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save order.");
      }

      /*
       * IMPORTANT:
       * Reset the form after a successful save.
       */
      resetForm();

      /*
       * If we were editing, close the edit mode.
       */
      if (isEditing) {
        onCancelEdit();
      }

      /*
       * Tell the parent component to reload
       * the orders and show the success toast.
       */
      onOrderSaved(
        isEditing
          ? "Order updated successfully."
          : "Order created successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Unable to save order.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <CardContent>
        <h2 className="mb-6 text-xl font-semibold">
          {selectedOrder ? "Update Order" : "Create Order"}
        </h2>

        <div className="grid gap-5">
          {/* Customer */}

          <div>
            <Label className="mb-2">Customer</Label>

            <Select
              value={userId}
              onValueChange={(value) => setUserId(value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name} — {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product */}

          <div>
            <Label className="mb-2">Product</Label>

            <Select
              value={productId}
              onValueChange={(value) => setProductId(value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((product) => product.active)
                  .map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name} — KSh{" "}
                      {Number(product.price).toLocaleString()}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected product information */}

          {selectedProduct && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p>
                Current Price:{" "}
                <strong>
                  KSh {Number(selectedProduct.price).toLocaleString()}
                </strong>
              </p>

              <p>
                Available Stock: <strong>{selectedProduct.stock}</strong>
              </p>
            </div>
          )}

          {/* Quantity */}

          <div>
            <Label htmlFor="order-quantity" className="mb-2">
              Quantity
            </Label>

            <Input
              id="order-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          {/* Status */}

          <div>
            <Label className="mb-2">Status</Label>

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((orderStatus) => (
                  <SelectItem key={orderStatus} value={orderStatus}>
                    {orderStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}

          <div className="flex gap-3">
            <Button type="button" disabled={loading} onClick={saveOrder}>
              {loading
                ? "Saving..."
                : selectedOrder
                  ? "Update Order"
                  : "Create Order"}
            </Button>

            {selectedOrder && (
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={() => {
                  resetForm();
                  onCancelEdit();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
