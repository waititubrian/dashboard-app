export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";

export interface Order {
  id: number;

  userId: number;
  productId: number;

  quantity: number;

  unitPrice: string;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;

  user: {
    id: number;
    name: string;
    email: string;
  };

  product: {
    id: number;
    name: string;
    price: string;
  };
}
