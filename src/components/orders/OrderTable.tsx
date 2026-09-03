import type { Order, OrderStatus } from "@/types/order";

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

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const statusBadgeVariant: Record<
  OrderStatus,
  "default" | "outline" | "destructive" | "secondary"
> = {
  PENDING: "outline",
  COMPLETED: "default",
  CANCELLED: "destructive",
  REFUNDED: "secondary",
};

export default function OrderTable({
  orders,
  onEdit,
  onDelete,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center"></TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, index) => {
            const total = Number(order.unitPrice) * order.quantity;

            return (
              <TableRow key={order.id}>
                <TableCell className="text-center">{index + 1}</TableCell>

                <TableCell>
                  <div className="font-medium">{order.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.user.email}
                  </div>
                </TableCell>

                <TableCell>{order.product.name}</TableCell>

                <TableCell className="text-center">
                  {order.quantity}
                </TableCell>

                <TableCell className="text-right">
                  KSh {Number(order.unitPrice).toLocaleString()}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  KSh {total.toLocaleString()}
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant={statusBadgeVariant[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button variant="warning" onClick={() => onEdit(order)}>
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => onDelete(order)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
