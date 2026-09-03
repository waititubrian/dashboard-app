import type { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface UserTableProps {
  users: User[];
  onDelete: (user: User) => void;
  onEdit: (user: User) => void;
}

export default function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="max-w-xs truncate">{user.email}</TableCell>

              <TableCell className="text-center">
                <Badge variant={user.active ? "default" : "outline"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button variant="warning" onClick={() => onEdit(user)}>
                    Edit
                  </Button>

                  <Button variant="destructive" onClick={() => onDelete(user)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
