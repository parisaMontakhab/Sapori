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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground/80">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground/80">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none"
          required
        />
      </div>
      {error && (
        <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="rounded-full bg-tomato py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark"
      >
        Login
      </button>
      <p className="text-center text-sm text-foreground/50">
        Demo account: marco@example.com / password123
      </p>
    </form>
  );
}
