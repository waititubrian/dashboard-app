"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";

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

      toast.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUserSaved(message: string) {
    toast.success(message);

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

      // Close dialog
      setUserToDelete(null);

      // Show success toast
      toast.success(`${deletedUserName} was deleted successfully.`);

      // Refresh users
      await loadUsers();
    } catch (error) {
      console.error(error);

      toast.error("Unable to delete user.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* PAGE TITLE */}
      <h1 className="mb-2 text-3xl font-bold">User Management</h1>

      {/* USER COUNT */}
      <p className="mb-6 text-muted-foreground">Total Users: {users.length}</p>

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

      {/* DELETE DIALOG */}
      <Dialog
        open={userToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setUserToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {userToDelete?.name}
            </span>
            ?
          </p>

          <DialogFooter>
            <Button
              variant="secondary"
              disabled={deleting}
              onClick={() => setUserToDelete(null)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={deleting}
              onClick={confirmDeleteUser}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
