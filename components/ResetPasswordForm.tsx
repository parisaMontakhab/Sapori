"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { inputClassName, validatePasswordPair } from "@/lib/formStyles";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword(token);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const passwordError = validatePasswordPair(password, passwordConfirm);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    setValidationError("");

    resetPasswordMutation.mutate(
      { password, passwordConfirm },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
          router.push("/profile");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Failed to reset password."));
        },
      },
    );
  }

  const apiError = resetPasswordMutation.isError
    ? getErrorMessage(resetPasswordMutation.error, "Failed to reset password.")
    : "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="reset-password"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          New Password
        </label>
        <input
          id="reset-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label
          htmlFor="reset-password-confirm"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          Confirm New Password
        </label>
        <input
          id="reset-password-confirm"
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          autoComplete="new-password"
          className={inputClassName}
          required
        />
      </div>

      {(validationError || apiError) && (
        <div className="space-y-3">
          {validationError && (
            <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
              {validationError}
            </p>
          )}
          {apiError && (
            <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
              {apiError}
            </p>
          )}
          {apiError && (
            <Link
              href="/forgot-password"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-tomato/30 px-6 py-2.5 text-sm font-semibold text-tomato transition-colors hover:bg-tomato/5"
            >
              Request a new reset link
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="min-h-11 w-full rounded-full bg-tomato py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
      >
        {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
