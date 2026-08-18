"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

type NotificationState = {
  type: "success" | "error";
  message: string;
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [notification, setNotification] =
    useState<NotificationState | null>(null);

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

      setNotification({
        type: "error",
        message: "Unable to load products.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleProductSaved(message: string) {
    setNotification({
      type: "success",
      message,
    });

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
      const response = await fetch(
        `/api/products/${productToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete product."
        );
      }

      const deletedProductName =
        productToDelete.name;

      if (
        selectedProduct?.id === productToDelete.id
      ) {
        setSelectedProduct(null);
      }

      setProductToDelete(null);

      setNotification({
        type: "success",
        message: `${deletedProductName} was deleted successfully.`,
      });

      await loadProducts();
    } catch (error) {
      console.error(error);

      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete product.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-2 text-3xl font-bold">
        Product Management
      </h1>

      <p className="mb-6 text-gray-400">
        Total Products: {products.length}
      </p>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

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

      <Modal
        isOpen={productToDelete !== null}
        title="Delete Product"
        onClose={() => {
          if (!deleting) {
            setProductToDelete(null);
          }
        }}
      >
        <p className="mb-6 text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {productToDelete?.name}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            disabled={deleting}
            onClick={() =>
              setProductToDelete(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            loading={deleting}
            onClick={confirmDeleteProduct}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}