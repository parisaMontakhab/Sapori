"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createOrder } from "@/services/orderService";
import { getProducts } from "@/services/productService";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  type CartItem,
} from "@/store/cart";
import { getLoggedInUser } from "@/store/auth";
import type { Product } from "@/types";

const DELIVERY_FEE = 3.5;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    setItems(getCart());
    getProducts().then(setProducts);
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

  const subtotal = getCartTotal(items);
  const total = subtotal + DELIVERY_FEE;

  function getProductDetails(productId: string) {
    return products.find((product) => product.id === productId);
  }

  return (
    <div
      className={`mx-auto ${items.length > 0 ? "max-w-6xl" : "max-w-2xl"}`}
    >
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
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const product = getProductDetails(item.productId);
              const lineTotal = item.price * item.quantity;

              return (
                <article
                  key={item.productId}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-md sm:gap-5 sm:p-5"
                >
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28"
                  >
                    {product?.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cream-dark text-3xl">
                        🍽️
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      {product?.category && (
                        <span className="mb-2 inline-block rounded-full bg-basil/10 px-3 py-1 text-xs font-semibold text-basil">
                          {product.category}
                        </span>
                      )}
                      <Link href={`/product/${item.productId}`}>
                        <h2 className="text-lg font-bold text-foreground hover:text-tomato">
                          {item.name}
                        </h2>
                      </Link>
                      <p className="mt-1 text-sm text-foreground/60">
                        €{item.price} each
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground/80">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                      <span className="text-xl font-bold text-tomato">
                        €{lineTotal}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="rounded-full border border-tomato/20 px-4 py-1.5 text-sm font-medium text-tomato transition-colors hover:bg-tomato/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-foreground">
                Order Summary
              </h2>
              <p className="mt-1 text-sm text-foreground/60">
                Review your total before placing the order
              </p>

              <div className="mt-6 space-y-3 border-b border-cream-dark pb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    €{subtotal}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Delivery fee</span>
                  <span className="font-semibold text-foreground">
                    €{DELIVERY_FEE.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-tomato">
                  €{total.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 w-full rounded-full bg-orange py-3.5 font-bold text-white shadow-md transition-colors hover:bg-orange-light"
              >
                Place Order
              </button>
            </div>
          </aside>
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
