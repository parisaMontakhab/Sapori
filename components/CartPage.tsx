"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createOrder } from "@/services/orderService";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  type CartItem,
} from "@/store/cart";
import { getLoggedInUser } from "@/store/auth";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  function handleRemove(productId: string) {
    removeFromCart(productId);
    setItems(getCart());
  }

  async function handleCheckout() {
    const user = getLoggedInUser();
    if (!user) {
      setMessage("Please login before checkout.");
      return;
    }

    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    await createOrder(user.id, items);
    clearCart();
    setItems([]);
    setMessage("Order placed successfully!");
  }

  const total = getCartTotal(items);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-zinc-500">
          Cart is empty.{" "}
          <Link href="/menu" className="text-red-700 underline">
            Browse menu
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-zinc-500">
                  €{item.price} × {item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.productId)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <p className="text-lg font-bold">Total: €{total}</p>

          <button
            onClick={handleCheckout}
            className="w-fit rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
          >
            Place Order
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
    </div>
  );
}
