import type { Product } from "@/types/product";

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
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>

              <TableCell className="max-w-xs truncate">
                {product.description || "—"}
              </TableCell>

              <TableCell className="text-right">
                {Number(product.price).toLocaleString()}
              </TableCell>

              <TableCell className="text-right">{product.stock}</TableCell>

              <TableCell className="text-center">
                <Badge variant={product.active ? "default" : "outline"}>
                  {product.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button variant="warning" onClick={() => onEdit(product)}>
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => onDelete(product)}
                  >
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
