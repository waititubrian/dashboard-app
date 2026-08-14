"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

import UserForm from "./UserForm";
import UserTable from "./UserTable";

type NotificationState = {
  type: "success" | "error";
  message: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

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

      setNotification({
        type: "error",
        message: "Unable to load users.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUserSaved(message: string) {
    setNotification({
      type: "success",
      message,
    });

    await loadUsers();
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

      // If the user being deleted is currently
      // being edited, exit edit mode.
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }

      const deletedUserName = userToDelete.name;

      // Close modal
      setUserToDelete(null);

      // Show success notification
      setNotification({
        type: "success",
        message: `${deletedUserName} was deleted successfully.`,
      });

      // Refresh users
      await loadUsers();
    } catch (error) {
      console.error(error);

      setNotification({
        type: "error",
        message: "Unable to delete user.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* PAGE TITLE */}
      <h1 className="mb-2 text-3xl font-bold">User Management</h1>

      {/* USER COUNT */}
      <p className="mb-6 text-gray-400">Total Users: {users.length}</p>

      {/* NOTIFICATION */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* CREATE / UPDATE FORM */}
      <UserForm
        selectedUser={selectedUser}
        onUserSaved={handleUserSaved}
        onCancelEdit={cancelEdit}
      />

      {/* USERS TABLE */}
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

      {/* DELETE MODAL */}
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
