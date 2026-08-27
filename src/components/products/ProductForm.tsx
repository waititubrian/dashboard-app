"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types/product";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  }, [selectedProduct]);

  async function saveProduct() {
    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!trimmedName) {
      toast.error("Product name is required.");
      return;
    }

    if (!price.trim()) {
      toast.error("Price is required.");
      return;
    }

    if (!Number.isFinite(numericPrice)) {
      toast.error("Price must be a valid number.");
      return;
    }

    if (numericPrice < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    if (!stock.trim()) {
      toast.error("Stock is required.");
      return;
    }

    if (!Number.isInteger(numericStock)) {
      toast.error("Stock must be a whole number.");
      return;
    }

    if (numericStock < 0) {
      toast.error("Stock cannot be negative.");
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
        throw new Error(data.error || "Unable to save product.");
      }

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setActive(true);

      onCancelEdit();

      onProductSaved(
        isEditing
          ? "Product updated successfully."
          : "Product created successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Unable to save product.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <CardContent>
        <h2 className="mb-6 text-xl font-semibold">
          {selectedProduct ? "Update Product" : "Create Product"}
        </h2>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await saveProduct();
          }}
        >
          <div className="mb-4">
            <Label htmlFor="product-name" className="mb-2">
              Product Name
            </Label>
            <Input
              id="product-name"
              value={name}
              placeholder="MacBook Pro"
              required
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="product-description" className="mb-2">
              Description
            </Label>
            <Textarea
              id="product-description"
              value={description}
              placeholder="14-inch MacBook Pro"
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="product-price" className="mb-2">
              Price
            </Label>
            <Input
              id="product-price"
              type="number"
              value={price}
              placeholder="250000"
              required
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="product-stock" className="mb-2">
              Stock
            </Label>
            <Input
              id="product-stock"
              type="number"
              value={stock}
              placeholder="10"
              required
              onChange={(event) => setStock(event.target.value)}
            />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="h-4 w-4"
            />

            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : selectedProduct
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
      </CardContent>
    </Card>
  );
}
