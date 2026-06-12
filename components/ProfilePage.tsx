"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/orderService";
import type { Order, User } from "@/types";
import { getLoggedInUser, logout } from "@/store/auth";
import { useRouter } from "next/navigation";

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
      <div>
        <p className="mb-4">You are not logged in.</p>
        <Link href="/login" className="text-red-700 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      <div className="mb-8 rounded border p-4">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      <h2 className="mb-4 text-xl font-bold">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded border p-4">
              <p className="font-medium">
                Order {order.id} — {order.status}
              </p>
              <p className="text-sm text-zinc-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2">Total: €{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
