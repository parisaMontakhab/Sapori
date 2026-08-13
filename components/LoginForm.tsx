"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { inputClassName } from "@/lib/formStyles";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/profile");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Invalid email or password"));
        },
      },
    );
  }

  const error = loginMutation.isError
    ? getErrorMessage(loginMutation.error, "Invalid email or password")
    : "";

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
          autoComplete="email"
          className={inputClassName}
          required
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-foreground/80">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-tomato hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className={inputClassName}
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
        disabled={loginMutation.isPending}
        className="min-h-11 w-full rounded-full bg-tomato py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
      >
        Login
      </button>
    </form>
  );
}
