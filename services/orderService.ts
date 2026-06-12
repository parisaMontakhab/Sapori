import { orders } from "@/data/orders";
import type { Order, OrderItem } from "@/types";

// TODO: Replace with GET /api/orders?userId=...
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return orders.filter((order) => order.userId === userId);
}

// TODO: Replace with GET /api/orders/:id
export async function getOrderById(id: string): Promise<Order | null> {
  return orders.find((order) => order.id === id) ?? null;
}

// TODO: Replace with POST /api/orders
export async function createOrder(
  userId: string,
  items: OrderItem[],
): Promise<Order> {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const newOrder: Order = {
    id: `order-${orders.length + 1}`,
    userId,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  return newOrder;
}
