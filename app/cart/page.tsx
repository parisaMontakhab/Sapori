import { Suspense } from "react";
import CartPage from "@/components/CartPage";

export default function Cart() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            Your Cart
          </h1>
          <p className="text-sm text-foreground/60">Loading...</p>
        </div>
      }
    >
      <CartPage />
    </Suspense>
  );
}
