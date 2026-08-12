"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
} from "@/services/orderService";
import { getAuthToken } from "@/store/auth";
import type { OrderItem } from "@/types";

export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: () => getOrdersByUser(""),
    enabled: Boolean(getAuthToken()),
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ""),
    queryFn: async () => {
      const order = await getOrderById(orderId!);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    },
    enabled: Boolean(orderId) && Boolean(getAuthToken()),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: OrderItem[]) => createOrder("", items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
