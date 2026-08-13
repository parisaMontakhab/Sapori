import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
      <p className="text-5xl" role="img" aria-hidden>
        🍽️
      </p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Product not found</h1>
      <p className="mt-2 text-foreground/60">
        This product may not exist or may have been removed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md hover:bg-tomato-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
