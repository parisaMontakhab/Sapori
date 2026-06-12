"use client";

import { useSyncExternalStore } from "react";
import type { Product } from "@/types";
import { addToCart, isInCart, subscribeToCart } from "@/store/cart";

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const inCart = useSyncExternalStore(
    subscribeToCart,
    () => isInCart(product.id),
    () => false,
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <button
      onClick={handleClick}
      className={`font-semibold text-white shadow-sm transition-all ${
        compact
          ? "rounded-full bg-orange px-4 py-2 text-sm hover:bg-orange-light"
          : "rounded-full bg-tomato px-8 py-3 text-base hover:bg-tomato-dark"
      } ${inCart ? "scale-95 bg-basil" : ""}`}
    >
      {inCart ? "✓ Added" : "Add to Cart"}
    </button>
  );
}
