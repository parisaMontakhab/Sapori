"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/authService";
import { saveLoggedInUser } from "@/store/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const user = await login(email, password);
    if (!user) {
      setError("Invalid email or password");
      return;
    }

    saveLoggedInUser(user);
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
      >
        Login
      </button>
      <p className="text-sm text-zinc-500">
        Demo: marco@example.com / password123
      </p>
    </form>
  );
}
