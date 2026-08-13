"use client";

import Link from "next/link";
import { useEffect } from "react";

interface RouteErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  showHomeLink?: boolean;
}

export default function RouteErrorFallback({
  error,
  reset,
  showHomeLink = true,
}: RouteErrorFallbackProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
      <p className="text-4xl" role="img" aria-hidden>
        ⚠️
      </p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-foreground/60 sm:text-base">
        We couldn&apos;t load this content. Please check your connection and
        try again.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark"
        >
          Try Again
        </button>
        {showHomeLink && (
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-cream-dark px-8 py-3 font-semibold text-foreground/80 transition-colors hover:bg-cream"
          >
            Back to Home
          </Link>
        )}
      </div>
    </div>
  );
}
