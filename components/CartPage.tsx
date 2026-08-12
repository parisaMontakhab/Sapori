"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import LoginRequiredModal from "@/components/LoginRequiredModal";
import QuantityStepper from "@/components/QuantityStepper";
import { useProducts } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import { getErrorMessage } from "@/lib/errors";
import {
  clearCart,
  getCartSnapshot,
  getCartTotal,
  getServerCartSnapshot,
  getStaleCartItems,
  isValidCartProductId,
  removeFromCart,
  removeStaleCartItems,
  subscribeToCart,
} from "@/store/cart";
import { getLoggedInUser } from "@/store/auth";

const DELIVERY_FEE = 3.5;
const FREE_DELIVERY_MIN = 25;

function formatEuro(amount: number): string {
  return Number.isInteger(amount) ? `€${amount}` : `€${amount.toFixed(2)}`;
}

export default function CartPage() {
  const router = useRouter();
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const { data: products = [] } = useProducts();
  const createOrderMutation = useCreateOrder();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  function handleRemove(productId: string) {
    removeFromCart(productId);
  }

  function handleCheckout() {
    const user = getLoggedInUser();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (items.length === 0) {
      setMessageType("error");
      setMessage("Your cart is empty.");
      return;
    }

    const staleItems = getStaleCartItems(items);
    if (staleItems.length > 0) {
      removeStaleCartItems();
      const staleMessage =
        staleItems.length === items.length
          ? "Your cart contains outdated items from a previous version. They have been removed — please add dishes again from the menu."
          : "Some outdated cart items were removed. Please review your cart before placing the order.";
      setMessageType("error");
      setMessage(staleMessage);
      toast.warning(staleMessage);
      return;
    }

    const validItems = items.filter((item) => isValidCartProductId(item.productId));
    if (validItems.length === 0) {
      setMessageType("error");
      setMessage("Your cart is empty.");
      return;
    }

    setMessage("");

    createOrderMutation.mutate(
      validItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      {
        onSuccess: () => {
          clearCart();
          toast.success("Order placed successfully!");
          router.push("/profile");
        },
        onError: (error) => {
          const message = getErrorMessage(error, "Failed to place order.");
          setMessageType("error");
          setMessage(message);
          toast.error(message);
        },
      },
    );
  }

  const subtotal = getCartTotal(items);
  const hasFreeDelivery = subtotal >= FREE_DELIVERY_MIN;
  const deliveryFee = hasFreeDelivery ? 0 : DELIVERY_FEE;
  const amountForFreeDelivery = Math.max(0, FREE_DELIVERY_MIN - subtotal);
  const total = subtotal + deliveryFee;

  function getProductDetails(productId: string) {
    return products.find((product) => product.id === productId);
  }

  return (
    <div
      className={`mx-auto ${items.length > 0 ? "max-w-6xl" : "max-w-2xl"}`}
    >
      <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Your Cart</h1>
      <p className="mb-6 text-foreground/60 sm:mb-8">
        Review your order before checkout
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
          <p className="text-5xl">🛒</p>
          <p className="mt-4 text-lg font-medium">Your cart is empty</p>
          <p className="mt-1 text-foreground/60">
            Add some delicious Italian dishes!
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
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

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
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
                        {formatEuro(item.price)} each
                      </p>
                      <div className="mt-3">
                        <QuantityStepper
                          productId={item.productId}
                          quantity={item.quantity}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="text-lg font-bold text-tomato sm:text-xl">
                        {formatEuro(lineTotal)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-tomato/20 px-4 py-2 text-sm font-medium text-tomato transition-colors hover:bg-tomato/10"
                      >
                        <span aria-hidden>🗑</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6 lg:sticky lg:top-[100px]">
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
                    {formatEuro(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Delivery fee</span>
                  <span
                    className={`font-semibold ${
                      hasFreeDelivery
                        ? "text-basil line-through decoration-foreground/30"
                        : "text-foreground"
                    }`}
                  >
                    {formatEuro(DELIVERY_FEE)}
                  </span>
                </div>
                {hasFreeDelivery ? (
                  <p className="rounded-xl bg-basil/10 px-3 py-2.5 text-sm font-medium text-basil">
                    🎉 Free delivery unlocked
                  </p>
                ) : (
                  <p className="rounded-xl bg-orange/10 px-3 py-2.5 text-sm text-foreground/80">
                    Add {formatEuro(amountForFreeDelivery)} more to get free
                    delivery 🚚
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-tomato">
                  {formatEuro(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={createOrderMutation.isPending}
                className="mt-6 min-h-11 w-full rounded-full bg-orange py-3.5 font-bold text-white shadow-md transition-colors hover:bg-orange-light disabled:opacity-60"
              >
                Place Order
              </button>
            </div>
          </aside>
        </div>
      )}

      {showLoginPrompt && (
        <LoginRequiredModal onClose={() => setShowLoginPrompt(false)} />
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
