"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { clearCart } from "@/store/cart";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const handledRef = useRef(false);
  const orderNumber = searchParams.get("order_number");

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    clearCart();
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    toast.success("Payment completed successfully!");
  }, [queryClient]);

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
      <p className="text-5xl">✅</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Payment successful!
      </h1>
      <p className="mt-2 text-foreground/60">
        Your order has been confirmed.
      </p>
      {orderNumber && (
        <p className="mt-4 max-w-full break-all px-1 text-sm font-medium text-foreground/60 sm:text-base">
          Order #{orderNumber}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/profile"
          className="flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
        >
          View My Orders
        </Link>
        <Link
          href="/menu"
          className="flex min-h-11 items-center justify-center rounded-full border border-cream-dark px-8 py-3 font-semibold text-foreground/80 transition-colors hover:bg-cream"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
