import * as repository from "@/repositories/user.repository";

export async function createUser(name: string, email: string) {
  if (!name.trim()) {
    throw new Error("Name is required.");
  }

  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  return repository.createUser(name, email);
}

export async function getUsers() {
  return repository.getUsers();
}

export async function getUserById(id: number) {
  return repository.getUserById(id);
}

export async function updateUser(
  id: number,
  name: string,
  email: string,
  active: boolean
) {
  if (!name.trim()) {
    throw new Error("Name is required.");
  }

  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  return repository.updateUser(id, name, email, active);
}

export async function deleteUser(id: number) {
  return repository.deleteUser(id);
}