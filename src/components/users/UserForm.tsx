"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

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

  async function saveUser() {
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
    <Card className="mb-8">
      <h2 className="mb-6 text-xl font-semibold">
        {selectedUser ? "Update User" : "Create User"}
      </h2>

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
          onChange={setName}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          placeholder="brian@example.com"
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
