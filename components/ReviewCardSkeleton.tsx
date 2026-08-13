export default function ReviewCardSkeleton() {
  return (
    <article
      className="rounded-2xl bg-white p-5 shadow-md sm:p-6"
      aria-hidden
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-cream-dark sm:h-11 sm:w-11" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="h-5 w-32 animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-24 animate-pulse rounded bg-cream-dark" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-cream-dark" />
          </div>
          <div className="h-4 w-28 animate-pulse rounded bg-cream-dark" />
        </div>
      </div>
    </article>
  );
}
