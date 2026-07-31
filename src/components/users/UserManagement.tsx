"use client";

import { useEffect, useState } from "react";
import UserTable from "./UserTable";
import UserForm from "./UserForm";

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const response = await fetch("/api/users");

    const data = await response.json();

    setUsers(data);
  }

  return (
    <div
      className="max-w-5xl mx-auto p-8"
    >
      <h1 className="text-3xl font-bold mb-2">User Management</h1>

      <p className=" text-gray-400 mb-6">Total Users: {users.length}</p>

      <UserForm onUserCreated={loadUsers} />

      <UserTable users={users} />
    </div>
  );
}
