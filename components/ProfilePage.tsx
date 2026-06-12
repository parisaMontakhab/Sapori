"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/orderService";
import type { Order, User } from "@/types";
import { getLoggedInUser, logout } from "@/store/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loggedIn = getLoggedInUser();
    if (!loggedIn) return;

    setUser(loggedIn);
    getOrdersByUser(loggedIn.id).then(setOrders);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-foreground/60">Manage your account and orders</p>
      </div>

      {/* User card */}
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-tomato to-orange text-2xl text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-foreground/60">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 rounded-full border border-tomato/30 px-6 py-2 text-sm font-medium text-tomato transition-colors hover:bg-tomato/5"
        >
          Logout
        </button>
      </div>

      {/* Orders */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Your Orders</h2>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-4xl">📦</p>
            <p className="mt-3 text-foreground/60">No orders yet.</p>
            <Link
              href="/menu"
              className="mt-4 inline-block text-sm font-semibold text-tomato hover:underline"
            >
              Start ordering →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-5 shadow-md sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    Order #{order.id}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-basil/10 text-basil"
                        : "bg-orange/10 text-orange"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/50">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-foreground/70">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.quantity}× {item.name}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-bold text-tomato">€{order.total}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
