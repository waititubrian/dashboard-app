import * as repository from "@/repositories/user.repository";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateUserData(name: string, email: string) {
  if (!name.trim()) {
    throw new Error("Name is required.");
  }

  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    throw new Error("Please enter a valid email address.");
  }
}

export async function createUser(name: string, email: string) {
  validateUserData(name, email);

  return repository.createUser(name.trim(), email.trim());
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
  active: boolean,
) {
  validateUserData(name, email);

  return repository.updateUser(id, name, email, active);
}

export async function deleteUser(id: number) {
  return repository.deleteUser(id);
}
