"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const response = await fetch("/api/users");

    if (!response.ok) {
      console.error("Failed to load users.");
      return;
    }

    const data = await response.json();

    setUsers(data);
  }

  async function deleteUser(id: number) {
    const confirmed = confirm("Are you sure you want to delete this user?");

    if (!confirmed) return;

    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Unable to delete user.");
      return;
    }

    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }

    await loadUsers();
  }

  function editUser(user: User) {
    setSelectedUser(user);
  }

  function cancelEdit() {
    setSelectedUser(null);
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>

      <p className="text-gray-400 mb-6">Total Users: {users.length}</p>

      <UserForm
        selectedUser={selectedUser}
        onUserSaved={loadUsers}
        onCancelEdit={cancelEdit}
      />

      <UserTable users={users} onDelete={deleteUser} onEdit={editUser} />
    </div>
  );
}
