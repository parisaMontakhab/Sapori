"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegister } from "@/hooks/useAuth";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Email already in use";
}

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          router.push("/profile");
        },
      },
    );
  }

  const error = registerMutation.isError
    ? getErrorMessage(registerMutation.error)
    : "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground/80">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground/80">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none"
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
          className="w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none"
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
        disabled={registerMutation.isPending}
        className="min-h-11 w-full rounded-full bg-basil py-3 font-semibold text-white shadow-md transition-colors hover:bg-basil-light disabled:opacity-60"
      >
        Create Account
      </button>
    </form>
  );
}
