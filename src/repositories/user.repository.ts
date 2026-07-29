import { prisma } from "@/lib/prisma";

export async function createUser(name: string, email: string) {
  return prisma.user.create({
    data: {
      name,
      email,
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function updateUser(
  id: number,
  name: string,
  email: string,
  active: boolean,
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      active,
    },
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}
