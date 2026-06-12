import type { Order } from "@/types";

export const orders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [
      { productId: "prod-1", name: "Margherita Pizza", price: 10, quantity: 2 },
      { productId: "prod-4", name: "Tiramisu", price: 8, quantity: 1 },
    ],
    total: 28,
    status: "delivered",
    createdAt: "2025-06-01T12:00:00.000Z",
  },
  {
    id: "order-2",
    userId: "user-2",
    items: [
      { productId: "prod-2", name: "Spaghetti Carbonara", price: 14, quantity: 1 },
    ],
    total: 14,
    status: "pending",
    createdAt: "2025-06-10T18:30:00.000Z",
  },
];
