"use client";

import { useEffect, useState } from "react";

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
    <div>
      <h1>User Management</h1>

      <p>Total Users: {users.length}</p>
    </div>
  );
}