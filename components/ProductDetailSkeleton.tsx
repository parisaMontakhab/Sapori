export default function ProductDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-cream-dark" />

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
        <div className="h-56 animate-pulse bg-cream-dark sm:h-72 md:h-96" />

        <div className="p-5 sm:p-8 md:p-10">
          <div className="h-7 w-24 animate-pulse rounded-full bg-cream-dark" />
          <div className="mt-4 h-10 w-2/3 max-w-lg animate-pulse rounded-lg bg-cream-dark" />
          <div className="mt-4 space-y-2 max-w-2xl">
            <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-cream-dark" />
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-cream-dark pt-6 sm:mt-8 sm:flex-row sm:items-center sm:gap-6 sm:pt-8">
            <div className="h-9 w-20 animate-pulse rounded bg-cream-dark" />
            <div className="h-11 w-36 animate-pulse rounded-full bg-cream-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
