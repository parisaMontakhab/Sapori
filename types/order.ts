export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
}
