"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Name is required.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Email is required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
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

      onCancelEdit();

      onUserSaved(
        selectedUser
          ? "User updated successfully."
          : "User created successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(error instanceof Error ? error.message : "Unable to save user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <CardContent>
        <h2 className="mb-6 text-xl font-semibold">
          {selectedUser ? "Update User" : "Create User"}
        </h2>

        <form
          onSubmit={async (event) => {
            event.preventDefault(); // Stops page reload
            await saveUser();
          }}
        >
          <div className="mb-4">
            <Label htmlFor="user-name" className="mb-2">
              Name
            </Label>
            <Input
              id="user-name"
              value={name}
              placeholder="Brian Waititu"
              required
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="user-email" className="mb-2">
              Email
            </Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              placeholder="brian@example.com"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : selectedUser
                  ? "Update User"
                  : "Create User"}
            </Button>

            {selectedUser && (
              <Button type="button" variant="secondary" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
