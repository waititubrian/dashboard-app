"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Notification from "../ui/Notification";

interface UserFormProps {
  selectedUser: User | null;
  onUserSaved: (message: string) => void;
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [selectedUser]);

  async function saveUser() {
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

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
          name: trimmedName,
          email: trimmedEmail,
          active: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Unable to save user.");
      }

      setName("");
      setEmail("");
      setError("");

      onCancelEdit();

      onUserSaved(
        selectedUser
          ? "User updated successfully."
          : "User created successfully.",
      );
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Unable to save user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <h2 className="mb-6 text-xl font-semibold">
        {selectedUser ? "Update User" : "Create User"}
      </h2>

      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault(); // Stops page reload
          await saveUser();
        }}
      >
        <Input
          label="Name"
          value={name}
          placeholder="Brian Waititu"
          required
          onChange={setName}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          placeholder="brian@example.com"
          required
          onChange={setEmail}
        />

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>
            {selectedUser ? "Update User" : "Create User"}
          </Button>

          {selectedUser && (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
