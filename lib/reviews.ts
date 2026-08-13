import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { Order } from "@/types";

export function invalidateAllReviewQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
}

export function isReviewableOrder(order: Order): boolean {
  if (order.paymentStatus) {
    return order.paymentStatus === "paid";
  }

  return (
    order.status === "confirmed" ||
    order.status === "preparing" ||
    order.status === "delivered"
  );
}

export function getProductReviewHref(productId: string): string {
  return `/product/${productId}#reviews`;
}
