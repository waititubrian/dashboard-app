import type { Product } from "@/types/product";

import Button from "@/components/ui/Button";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 p-8 text-center text-gray-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-700 px-4 py-3 text-left">
              ID
            </th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Product
            </th>

            <th className="border border-gray-700 px-4 py-3 text-left">
              Description
            </th>

            <th className="border border-gray-700 px-4 py-3 text-right">
              Price
            </th>

            <th className="border border-gray-700 px-4 py-3 text-right">
              Stock
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
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-900"
            >
              <td className="border border-gray-700 px-4 py-3">
                {product.id}
              </td>

              <td className="border border-gray-700 px-4 py-3 font-medium">
                {product.name}
              </td>

              <td className="max-w-xs truncate border border-gray-700 px-4 py-3">
                {product.description || "—"}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-right">
                {Number(product.price).toLocaleString()}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-right">
                {product.stock}
              </td>

              <td className="border border-gray-700 px-4 py-3 text-center">
                {product.active ? "✅" : "❌"}
              </td>

              <td className="border border-gray-700 px-4 py-3">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="warning"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => onDelete(product)}
                  >
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