"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Notification from "@/components/ui/Notification";

interface ProductFormProps {
  selectedProduct: Product | null;
  onProductSaved: (message: string) => void;
  onCancelEdit: () => void;
}

export default function ProductForm({
  selectedProduct,
  onProductSaved,
  onCancelEdit,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description ?? "");
      setPrice(selectedProduct.price);
      setStock(String(selectedProduct.stock));
      setActive(selectedProduct.active);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setActive(true);
    }

    setError("");
  }, [selectedProduct]);

  async function saveProduct() {
    setError("");

    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!trimmedName) {
      setError("Product name is required.");
      return;
    }

    if (!price.trim()) {
      setError("Price is required.");
      return;
    }

    if (!Number.isFinite(numericPrice)) {
      setError("Price must be a valid number.");
      return;
    }

    if (numericPrice < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (!stock.trim()) {
      setError("Stock is required.");
      return;
    }

    if (!Number.isInteger(numericStock)) {
      setError("Stock must be a whole number.");
      return;
    }

    if (numericStock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const isEditing = selectedProduct !== null;

      const url = isEditing
        ? `/api/products/${selectedProduct.id}`
        : "/api/products";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: description.trim() || null,
          price: numericPrice,
          stock: numericStock,
          active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save product."
        );
      }

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setActive(true);
      setError("");

      onCancelEdit();

      onProductSaved(
        isEditing
          ? "Product updated successfully."
          : "Product created successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <h2 className="mb-6 text-xl font-semibold">
        {selectedProduct
          ? "Update Product"
          : "Create Product"}
      </h2>

      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await saveProduct();
        }}
      >
        <Input
          label="Product Name"
          value={name}
          placeholder="MacBook Pro"
          required
          onChange={setName}
        />

        <Input
          label="Description"
          value={description}
          placeholder="14-inch MacBook Pro"
          onChange={setDescription}
        />

        <Input
          label="Price"
          type="number"
          value={price}
          placeholder="250000"
          required
          onChange={setPrice}
        />

        <Input
          label="Stock"
          type="number"
          value={stock}
          placeholder="10"
          required
          onChange={setStock}
        />

        <div className="mb-6 flex items-center gap-3">
          <input
            id="active"
            type="checkbox"
            checked={active}
            onChange={(event) =>
              setActive(event.target.checked)
            }
            className="h-4 w-4"
          />

          <label htmlFor="active">
            Active
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            loading={loading}
          >
            {selectedProduct
              ? "Update Product"
              : "Create Product"}
          </Button>

          {selectedProduct && (
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
      </form>
    </Card>
  );
}