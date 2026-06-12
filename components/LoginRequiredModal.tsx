"use client";

import Link from "next/link";

export default function LoginRequiredModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <p className="text-4xl" aria-hidden>
          🔐
        </p>
        <h2
          id="login-required-title"
          className="mt-4 text-xl font-bold text-foreground"
        >
          Please log in to place your order.
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Sign in to save your order and track delivery.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-full bg-orange px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-orange-light"
          >
            Login
          </Link>
          <Link
            href="/menu"
            onClick={onClose}
            className="rounded-full border border-cream-dark px-8 py-3 font-semibold text-foreground/80 transition-colors hover:bg-cream"
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
