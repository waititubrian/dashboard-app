import type { User } from "@/types/user";

import Button from "@/components/ui/Button";

interface UserTableProps {
  users: User[];
  onDelete: (user: User) => void;
  onEdit: (user: User) => void;
}

export default function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 p-8 text-center text-gray-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full border border-gray-700 rounded-lg">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-700 px-4 py-3 text-left">ID</th>

            <th className="border border-gray-700 px-4 py-3 text-left">Name</th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Email
            </th>

            <th className="border border-gray-700 px-4 py-3 text-center">
              Active
            </th>

            <th className="border border-gray-700 px-4 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-900">
              <td className="border border-gray-700 px-4 py-3">{user.id}</td>

              <td className="border border-gray-700 px-4 py-3">{user.name}</td>

              <td className="max-w-xs truncate border border-gray-700 px-4 py-3">
                {user.email}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-center">
                {user.active ? "✅" : "❌"}
              </td>

              <td className="border border-gray-700 px-4 py-3">
                <div className="flex justify-center gap-2">
                  <Button variant="warning" onClick={() => onEdit(user)}>
                    Edit
                  </Button>

                  <Button variant="danger" onClick={() => onDelete(user)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
