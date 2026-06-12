"use client";

import type { Product } from "@/types";
import { addToCart } from "@/store/cart";

export default function AddToCartButton({ product }: { product: Product }) {
  function handleClick() {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
    >
      Add to Cart
    </button>
  );
}
