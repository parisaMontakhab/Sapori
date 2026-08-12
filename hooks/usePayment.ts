"use client";

import { useMutation } from "@tanstack/react-query";
import { getCheckoutSession } from "@/services/paymentService";

export function useCheckoutSession() {
  return useMutation({
    mutationFn: (orderId: string) => getCheckoutSession(orderId),
  });
}
