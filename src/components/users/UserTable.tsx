import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => Promise<void>;
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
    <div className="overflow-x-auto mt-8">
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

              <td className="border border-gray-700 px-4 py-3 max-w-xs truncate">
                {user.email}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-center">
                {user.active ? "✅" : "❌"}
              </td>

              <td className="border border-gray-700 px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
