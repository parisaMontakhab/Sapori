export default function ProductCardSkeleton() {
  return (
    <article
      className="overflow-hidden rounded-2xl bg-white shadow-md"
      aria-hidden
    >
      <div className="h-[200px] animate-pulse bg-cream-dark sm:h-[220px]" />
      <div className="p-5">
        <div className="mb-2 h-6 w-20 animate-pulse rounded-full bg-cream-dark" />
        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-cream-dark" />
        <div className="mt-2 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-cream-dark" />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-7 w-16 animate-pulse rounded bg-cream-dark" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-cream-dark" />
        </div>
      </div>
    </article>
  );
}
