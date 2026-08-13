"use client";

import Link from "next/link";
import QueryErrorState from "@/components/QueryErrorState";
import ReviewCard from "@/components/ReviewCard";
import ReviewCardSkeleton from "@/components/ReviewCardSkeleton";
import { useAllReviews } from "@/hooks/useReviews";
import { getErrorMessage } from "@/lib/errors";

export default function AllReviewsPageContent() {
  const {
    data: reviews = [],
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isRefetching,
  } = useAllReviews();

  const isLoading = isPending || isFetching;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Customer Reviews
        </h1>
        <p className="mt-2 text-foreground/60">
          Read what diners are saying about Sapori dishes.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
        </div>
      ) : isError ? (
        <QueryErrorState
          title="Unable to load reviews"
          message={getErrorMessage(
            error,
            "Something went wrong while loading reviews.",
          )}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">
          <p className="text-foreground/70">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-2">
              {review.productId && (
                <Link
                  href={`/product/${review.productId}`}
                  className="inline-block text-sm font-medium text-basil transition-colors hover:text-basil/80"
                >
                  {review.productName ?? "View product"}
                </Link>
              )}
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
