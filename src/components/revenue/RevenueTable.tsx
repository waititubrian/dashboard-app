import type { RevenueByOrder } from "@/types/revenue";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface RevenueTableProps {
  orders: RevenueByOrder[];
}

export default function RevenueTable({ orders }: RevenueTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        No completed orders yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell className="text-center">#{order.orderId}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell className="text-center">{order.quantity}</TableCell>

              <TableCell className="text-right">
                KSh {order.unitPrice.toLocaleString()}
              </TableCell>

              <TableCell className="text-right font-semibold">
                KSh {order.total.toLocaleString()}
              </TableCell>

              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
