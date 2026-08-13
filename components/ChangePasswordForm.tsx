"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { inputClassName, validatePasswordPair } from "@/lib/formStyles";

export default function ChangePasswordForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const updatePasswordMutation = useUpdatePassword();
  const [passwordCurrent, setPasswordCurrent] = useState("");
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

    if (!passwordCurrent.trim()) {
      setValidationError("Current password is required.");
      return;
    }

    setValidationError("");

    updatePasswordMutation.mutate(
      { passwordCurrent, password, passwordConfirm },
      {
        onSuccess: () => {
          setPasswordCurrent("");
          setPassword("");
          setPasswordConfirm("");
          onCancel();
          toast.success("Password updated successfully!");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Failed to update password."));
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="current-password"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          value={passwordCurrent}
          onChange={(event) => setPasswordCurrent(event.target.value)}
          autoComplete="current-password"
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          New Password
        </label>
        <input
          id="new-password"
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
          htmlFor="confirm-new-password"
          className="mb-1.5 block text-sm font-medium text-foreground/80"
        >
          Confirm New Password
        </label>
        <input
          id="confirm-new-password"
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          autoComplete="new-password"
          className={inputClassName}
          required
        />
      </div>

      {validationError && (
        <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
          {validationError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={updatePasswordMutation.isPending}
          className="min-h-11 rounded-full border border-cream-dark bg-white px-6 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-cream disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updatePasswordMutation.isPending}
          className="min-h-11 rounded-full bg-tomato px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
        >
          {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
