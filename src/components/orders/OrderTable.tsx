import type { Order } from "@/types/order";

import Button from "@/components/ui/Button";

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export default function OrderTable({
  orders,
  onEdit,
  onDelete,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 p-8 text-center text-gray-400">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-700 px-4 py-3">
              ID
            </th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Customer
            </th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Product
            </th>

            <th className="border border-gray-700 px-4 py-3">
              Quantity
            </th>

            <th className="border border-gray-700 px-4 py-3">
              Unit Price
            </th>

            <th className="border border-gray-700 px-4 py-3">
              Total
            </th>

            <th className="border border-gray-700 px-4 py-3">
              Status
            </th>

            <th className="border border-gray-700 px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const total =
              Number(order.unitPrice) *
              order.quantity;

            return (
              <tr key={order.id}>
                <td className="border border-gray-700 px-4 py-3 text-center">
                  {order.id}
                </td>

                <td className="border border-gray-700 px-4 py-3">
                  <div className="font-medium">
                    {order.user.name}
                  </div>

                  <div className="text-sm text-gray-400">
                    {order.user.email}
                  </div>
                </td>

                <td className="border border-gray-700 px-4 py-3">
                  {order.product.name}
                </td>

                <td className="border border-gray-700 px-4 py-3 text-center">
                  {order.quantity}
                </td>

                <td className="border border-gray-700 px-4 py-3 text-right">
                  KSh{" "}
                  {Number(
                    order.unitPrice
                  ).toLocaleString()}
                </td>

                <td className="border border-gray-700 px-4 py-3 text-right font-semibold">
                  KSh{" "}
                  {total.toLocaleString()}
                </td>

                <td className="border border-gray-700 px-4 py-3 text-center">
                  {order.status}
                </td>

                <td className="border border-gray-700 px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="warning"
                      onClick={() =>
                        onEdit(order)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        onDelete(order)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}