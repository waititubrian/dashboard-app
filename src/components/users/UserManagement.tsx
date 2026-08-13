"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";

import UserForm from "./UserForm";
import UserTable from "./UserTable";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    try {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to load users.");
      }

      const data: User[] = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function editUser(user: User) {
    setSelectedUser(user);
  }

  function cancelEdit() {
    setSelectedUser(null);
  }

  function requestDeleteUser(user: User) {
    setUserToDelete(user);
  }

  async function confirmDeleteUser() {
    if (!userToDelete) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete user.");
      }

      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }

      setUserToDelete(null);

      await loadUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-3xl font-bold">User Management</h1>

      <p className="mb-6 text-gray-400">Total Users: {users.length}</p>

      <UserForm
        selectedUser={selectedUser}
        onUserSaved={loadUsers}
        onCancelEdit={cancelEdit}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="large" />
        </div>
      ) : (
        <UserTable
          users={users}
          onDelete={requestDeleteUser}
          onEdit={editUser}
        />
      )}

      <Modal
        isOpen={userToDelete !== null}
        title="Delete User"
        onClose={() => {
          if (!deleting) {
            setUserToDelete(null);
          }
        }}
      >
        <p className="mb-6 text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{userToDelete?.name}</span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            disabled={deleting}
            onClick={() => setUserToDelete(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            loading={deleting}
            onClick={confirmDeleteUser}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
