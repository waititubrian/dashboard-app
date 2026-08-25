import type { RevenueByOrder } from "@/types/revenue";

interface RevenueTableProps {
  orders: RevenueByOrder[];
}

export default function RevenueTable({ orders }: RevenueTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 p-8 text-center text-gray-400">
        No completed orders yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-700 px-4 py-3">Order</th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Customer
            </th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Product
            </th>

            <th className="border border-gray-700 px-4 py-3">Quantity</th>

            <th className="border border-gray-700 px-4 py-3">Unit Price</th>

            <th className="border border-gray-700 px-4 py-3">Revenue</th>

            <th className="border border-gray-700 px-4 py-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td className="border border-gray-700 px-4 py-3 text-center">
                #{order.orderId}
              </td>

              <td className="border border-gray-700 px-4 py-3">
                {order.customerName}
              </td>

              <td className="border border-gray-700 px-4 py-3">
                {order.productName}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-center">
                {order.quantity}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-right">
                KSh {order.unitPrice.toLocaleString()}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-right font-semibold">
                KSh {order.total.toLocaleString()}
              </td>

              <td className="border border-gray-700 px-4 py-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
