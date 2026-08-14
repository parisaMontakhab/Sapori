"use client";

interface MenuPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MenuPagination({
  page,
  totalPages,
  onPageChange,
}: MenuPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <nav
      className="flex items-center justify-center gap-3 sm:gap-4"
      aria-label="Menu pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={isFirstPage}
        aria-label="Previous page"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-dark bg-white text-lg font-semibold text-foreground shadow-sm transition-colors hover:bg-cream disabled:pointer-events-none disabled:opacity-40"
      >
        ←
      </button>

      <div className="flex max-w-[min(100%,16rem)] items-center justify-center gap-2 overflow-x-auto px-1 sm:max-w-none">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => {
            const isActive = pageNumber === page;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
                className={`h-2.5 w-2.5 shrink-0 rounded-full transition-all ${
                  isActive
                    ? "bg-tomato shadow-sm"
                    : "bg-cream-dark hover:bg-orange/50"
                }`}
              />
            );
          },
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={isLastPage}
        aria-label="Next page"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-dark bg-white text-lg font-semibold text-foreground shadow-sm transition-colors hover:bg-cream disabled:pointer-events-none disabled:opacity-40"
      >
        →
      </button>
    </nav>
  );
}
