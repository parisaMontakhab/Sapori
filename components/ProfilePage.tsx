"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/orderService";
import { getProducts } from "@/services/productService";
import type { Order, Product, User } from "@/types";
import { getLoggedInUser, logout } from "@/store/auth";

function getItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function formatItemSummary(count: number): string {
  return count === 1 ? "1 item" : `${count} items`;
}

function getStatusBadgeClasses(status: Order["status"] | "cancelled"): string {
  if (status === "delivered") return "bg-basil/10 text-basil";
  if (status === "cancelled") return "bg-tomato/10 text-tomato";
  return "bg-orange/10 text-orange";
}

function formatStatusLabel(status: Order["status"] | "cancelled"): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getFavoriteCategory(orders: Order[], products: Product[]): string {
  const counts: Record<string, number> = {};

  for (const order of orders) {
    for (const item of order.items) {
      const category = products.find(
        (product) => product.id === item.productId,
      )?.category;

      if (category) {
        counts[category] = (counts[category] ?? 0) + item.quantity;
      }
    }
  }

  const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return topCategory?.[0] ?? "—";
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loggedIn = getLoggedInUser();
    if (!loggedIn) return;

    setUser(loggedIn);
    getOrdersByUser(loggedIn.id).then(setOrders);
    getProducts().then(setProducts);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function getProductImage(productId: string): string | undefined {
    return products.find((product) => product.id === productId)?.imageUrl;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-12 text-center shadow-md">
        <p className="text-5xl">👋</p>
        <p className="mt-4 text-lg font-medium">You are not logged in</p>
        <p className="mt-1 text-foreground/60">
          Sign in to view your profile and orders.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const favoriteCategory = getFavoriteCategory(orders, products);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-foreground/60">
          Manage your account and orders
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <div className="bg-gradient-to-r from-tomato/10 via-orange/10 to-cream-dark px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tomato to-orange text-3xl font-bold text-white shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {user.name}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  Food Lover • Member since 2026
                </p>
                <p className="mt-2 text-sm text-foreground/70">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="self-start rounded-full border border-tomato/30 bg-white px-6 py-2.5 text-sm font-semibold text-tomato transition-colors hover:bg-tomato/5 sm:self-center"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-2xl" role="img" aria-hidden>
            📦
          </p>
          <p className="mt-3 text-sm text-foreground/60">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {orders.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-2xl" role="img" aria-hidden>
            💰
          </p>
          <p className="mt-3 text-sm text-foreground/60">Total Spent</p>
          <p className="mt-1 text-2xl font-bold text-tomato">€{totalSpent}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-2xl" role="img" aria-hidden>
            🍕
          </p>
          <p className="mt-3 text-sm text-foreground/60">Favorite Category</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {favoriteCategory}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Your Orders</h2>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md sm:p-12">
            <p className="text-5xl">📦</p>
            <p className="mt-4 text-lg font-semibold text-foreground">
              No orders yet
            </p>
            <p className="mt-2 text-foreground/60">
              Place your first order and track it here.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = getItemCount(order);
              const firstImage = getProductImage(order.items[0]?.productId ?? "");

              return (
                <article
                  key={order.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-md sm:gap-5 sm:p-5"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                    {firstImage ? (
                      <Image
                        src={firstImage}
                        alt={order.items[0]?.name ?? "Order item"}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cream-dark text-3xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-foreground">
                          Order #{order.id}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(order.status)}`}
                        >
                          {formatStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground/60">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground/80">
                        {formatItemSummary(itemCount)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-foreground/60">Total</p>
                      <p className="text-2xl font-bold text-tomato">
                        €{order.total}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
