export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-700 rounded-lg">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-700 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-700 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-700 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-700 px-4 py-2 text-left">Active</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr className="hover:bg-gray-900" key={user.id} >
              <td className="border border-gray-700 px-4 py-2">{user.id}</td>
              <td className="border border-gray-700 px-4 py-2">{user.name}</td>
              <td className="border border-gray-700 px-4 py-2 max-w-xs truncate">{user.email}</td>
              <td className="border border-gray-700 px-4 py-2 text-center">{user.active ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
