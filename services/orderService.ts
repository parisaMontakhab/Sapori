import { ApiError, apiFetch } from "@/lib/api";
import { mapOrder, type BackendOrder } from "@/lib/mappers";
import type { Order, OrderItem } from "@/types";

interface MyOrdersResponse {
  status: string;
  data: {
    orders: BackendOrder[];
  };
}

interface MyOrderResponse {
  status: string;
  data: {
    order: BackendOrder;
  };
}

interface CreateOrderBody {
  products: Array<{
    product: string;
    quantity: number;
  }>;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  void userId;

  const response = await apiFetch<MyOrdersResponse>("/orders/my-orders");
  return response.data.orders.map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const response = await apiFetch<MyOrderResponse>(`/orders/my-orders/${id}`);
    return mapOrder(response.data.order);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function createOrder(
  userId: string,
  items: OrderItem[],
): Promise<Order> {
  void userId;

  const body: CreateOrderBody = {
    products: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    })),
  };

  const response = await apiFetch<MyOrderResponse>("/orders/my-orders", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return mapOrder(response.data.order);
}
