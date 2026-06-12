"use client";

import { updateCartItemQuantity } from "@/store/cart";

export default function QuantityStepper({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  function decrease() {
    updateCartItemQuantity(productId, quantity - 1);
  }

  function increase() {
    updateCartItemQuantity(productId, quantity + 1);
  }

  return (
    <div className="inline-flex items-center rounded-full border border-cream-dark bg-cream/50">
      <button
        type="button"
        onClick={decrease}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center rounded-l-full text-lg font-semibold text-foreground/70 transition-colors hover:bg-cream-dark hover:text-tomato"
      >
        −
      </button>
      <span className="min-w-[2rem] px-1 text-center text-sm font-bold text-foreground">
        {quantity}
      </span>
      <button
        type="button"
        onClick={increase}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center rounded-r-full text-lg font-semibold text-foreground/70 transition-colors hover:bg-cream-dark hover:text-tomato"
      >
        +
      </button>
    </div>
  );
}
