"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { inputClassName } from "@/lib/formStyles";

export default function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    forgotPasswordMutation.mutate(email.trim(), {
      onSuccess: () => {
        setSubmitted(true);
        toast.success("Password reset link sent!");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Failed to send reset link."));
      },
    });
  }

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-foreground/70">
          Check your email for a password reset link.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="forgot-email"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className={inputClassName}
          required
        />
      </div>

      <button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="min-h-11 w-full rounded-full bg-tomato py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
      >
        {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center text-sm text-foreground/60">
        <Link href="/login" className="font-semibold text-tomato hover:underline">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
