import { prisma } from "@/lib/prisma";

export async function createProduct(
  name: string,
  description: string | null,
  price: number,
  stock: number,
  active: boolean
) {
  return prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      active,
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}

export async function updateProduct(
  id: number,
  name: string,
  description: string | null,
  price: number,
  stock: number,
  active: boolean
) {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      price,
      stock,
      active,
    },
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}