"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types/product";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";

import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null,
  );

  const [productToDelete, setProductToDelete] = useState<Product | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to load products.");
      }

      const data: Product[] = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleProductSaved(message: string) {
    toast.success(message);

    await loadProducts();
  }

  function editProduct(product: Product) {
    setSelectedProduct(product);
  }

  function cancelEdit() {
    setSelectedProduct(null);
  }

  function requestDeleteProduct(product: Product) {
    setProductToDelete(product);
  }

  async function confirmDeleteProduct() {
    if (!productToDelete) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }

      const deletedProductName = productToDelete.name;

      if (selectedProduct?.id === productToDelete.id) {
        setSelectedProduct(null);
      }

      setProductToDelete(null);

      toast.success(`${deletedProductName} was deleted successfully.`);

      await loadProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Unable to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Product Management</h1>

      <p className="mb-6 text-muted-foreground">
        Total Products: {products.length}
      </p>

      <ProductForm
        selectedProduct={selectedProduct}
        onProductSaved={handleProductSaved}
        onCancelEdit={cancelEdit}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="large" />
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={editProduct}
          onDelete={requestDeleteProduct}
        />
      )}

      <Dialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setProductToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {productToDelete?.name}
            </span>
            ?
          </p>

          <DialogFooter>
            <Button
              variant="secondary"
              disabled={deleting}
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={deleting}
              onClick={confirmDeleteProduct}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
