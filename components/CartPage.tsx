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
  const [messageType, setMessageType] = useState<"success" | "error">("success");

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
      setMessageType("error");
      setMessage("Please log in before placing your order.");
      return;
    }

    if (items.length === 0) {
      setMessageType("error");
      setMessage("Your cart is empty.");
      return;
    }

    await createOrder(user.id, items);
    clearCart();
    setItems([]);
    setMessageType("success");
    setMessage("Order placed successfully! Buon appetito! 🍝");
  }

  const total = getCartTotal(items);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Your Cart</h1>
      <p className="mb-8 text-foreground/60">
        Review your order before checkout
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-md">
          <p className="text-5xl">🛒</p>
          <p className="mt-4 text-lg font-medium">Your cart is empty</p>
          <p className="mt-1 text-foreground/60">
            Add some delicious Italian dishes!
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-block rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-md"
            >
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 text-sm text-foreground/60">
                  €{item.price} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-tomato">
                  €{item.price * item.quantity}
                </span>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-sm font-medium text-tomato hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-cream-dark pb-4">
              <span className="text-foreground/70">Subtotal</span>
              <span className="font-semibold">€{total}</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-tomato">€{total}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-full bg-tomato py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 rounded-xl p-4 text-sm font-medium ${
            messageType === "success"
              ? "bg-basil/10 text-basil"
              : "bg-tomato/10 text-tomato"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
