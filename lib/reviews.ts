import type { Order } from "@/types";

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
