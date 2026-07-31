"use client";

import { useState } from "react";

interface UserFormProps {
  onUserCreated: () => Promise<void>;
}

export default function UserForm({
  onUserCreated,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function createUser() {
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user.");
      }

      setName("");
      setEmail("");

      await onUserCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mb-8 rounded-lg border border-gray-700 bg-gray-900 p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        await createUser();
      }}
    >
      <h2 className="mb-6 text-xl font-semibold">
        Create User
      </h2>

      <div className="mb-4">
        <label className="mb-2 block">
          Name
        </label>

        <input
          className="w-full rounded border border-gray-600 bg-gray-800 p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block">
          Email
        </label>

        <input
          type="email"
          className="w-full rounded border border-gray-600 bg-gray-800 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}