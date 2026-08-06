"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";

interface UserFormProps {
  selectedUser: User | null;
  onUserSaved: () => Promise<void>;
  onCancelEdit: () => void;
}

export default function UserForm({
  selectedUser,
  onUserSaved,
  onCancelEdit,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [selectedUser]);

  async function createUser() {
    setLoading(true);

    try {
      const isEditing = selectedUser !== null;

      const url = isEditing ? `/api/users/${selectedUser.id}` : "/api/users";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          active: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save user.");
      }

      setName("");
      setEmail("");

      onCancelEdit();

      await onUserSaved();
    } catch (error) {
      console.error(error);
      alert("Unable to save user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mb-8 rounded-lg border border-gray-700 bg-gray-900 p-6"
      onSubmit={async (event) => {
        event.preventDefault(); // Stops page reload
        await createUser();
      }}
    >
      <h2 className="mb-6 text-xl font-semibold">
        {selectedUser ? "Update User" : "Create User"}
      </h2>

      <div className="mb-4">
        <label className="mb-2 block">Name</label>

        <input
          className="w-full rounded border border-gray-600 bg-gray-800 p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block">Email</label>

        <input
          type="email"
          className="w-full rounded border border-gray-600 bg-gray-800 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : selectedUser ? "Update User" : "Create User"}
        </button>

        {selectedUser && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded bg-gray-600 px-5 py-2 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
