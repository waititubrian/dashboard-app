import * as repository from "@/repositories/product.repository";

function validateProductData(
  name: string,
  price: number,
  stock: number
) {
  if (!name.trim()) {
    throw new Error("Product name is required.");
  }

  if (!Number.isFinite(price)) {
    throw new Error("Price must be a valid number.");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative.");
  }

  if (!Number.isInteger(stock)) {
    throw new Error("Stock must be a whole number.");
  }

  if (stock < 0) {
    throw new Error("Stock cannot be negative.");
  }
}

export async function createProduct(
  name: string,
  description: string | null,
  price: number,
  stock: number,
  active: boolean
) {
  validateProductData(name, price, stock);

  return repository.createProduct(
    name.trim(),
    description?.trim() || null,
    price,
    stock,
    active
  );
}

export async function getProducts() {
  return repository.getProducts();
}

export async function getProductById(id: number) {
  return repository.getProductById(id);
}

export async function updateProduct(
  id: number,
  name: string,
  description: string | null,
  price: number,
  stock: number,
  active: boolean
) {
  validateProductData(name, price, stock);

  return repository.updateProduct(
    id,
    name.trim(),
    description?.trim() || null,
    price,
    stock,
    active
  );
}

export async function deleteProduct(id: number) {
  return repository.deleteProduct(id);
}