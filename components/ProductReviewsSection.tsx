"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QueryErrorState from "@/components/QueryErrorState";
import ReviewCard from "@/components/ReviewCard";
import ReviewCardSkeleton from "@/components/ReviewCardSkeleton";
import StarRating from "@/components/StarRating";
import StarRatingInput from "@/components/StarRatingInput";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMyOrders } from "@/hooks/useOrders";
import {
  useCreateReview,
  useDeleteReview,
  useProductReviews,
  useUpdateReview,
} from "@/hooks/useReviews";
import { getErrorMessage } from "@/lib/errors";
import { isReviewableOrder } from "@/lib/reviews";
import { getAuthToken } from "@/store/auth";
import type { Order } from "@/types";

const inputClassName =
  "w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none";

interface ProductReviewsSectionProps {
  productId: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

function hasPurchasedProduct(orders: Order[], productId: string): boolean {
  return orders.some(
    (order) =>
      isReviewableOrder(order) &&
      order.items.some((item) => item.productId === productId),
  );
}

export default function ProductReviewsSection({
  productId,
  ratingsAverage,
  ratingsQuantity = 0,
}: ProductReviewsSectionProps) {
  const isLoggedIn = Boolean(getAuthToken());
  const { data: currentUser } = useCurrentUser();
  const { data: orders = [] } = useMyOrders();
  const {
    data: reviews = [],
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isRefetching,
  } = useProductReviews(productId);

  const createReviewMutation = useCreateReview(productId);
  const updateReviewMutation = useUpdateReview(productId);
  const deleteReviewMutation = useDeleteReview(productId);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [validationError, setValidationError] = useState("");

  const isLoadingReviews = isPending || isFetching;
  const averageRating = ratingsAverage ?? 0;
  const reviewCount = ratingsQuantity ?? reviews.length;
  const ownReview = reviews.find(
    (review) => review.user.id === currentUser?.id,
  );
  const hasPurchased = hasPurchasedProduct(orders, productId);
  const canCreateReview = isLoggedIn && hasPurchased && !ownReview;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#reviews") return;
    if (isLoadingReviews) return;

    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  }, [isLoadingReviews]);

  function handleCreateReview(event: React.FormEvent) {
    event.preventDefault();

    const trimmedReview = reviewText.trim();

    if (!trimmedReview) {
      setValidationError("Review text cannot be empty.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationError("Rating must be between 1 and 5.");
      return;
    }

    setValidationError("");

    createReviewMutation.mutate(
      { review: trimmedReview, rating },
      {
        onSuccess: () => {
          setReviewText("");
          setRating(5);
          toast.success("Review submitted successfully!");
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Failed to submit review."));
        },
      },
    );
  }

  function handleUpdateReview(
    reviewId: string,
    payload: { review: string; rating: number },
  ) {
    updateReviewMutation.mutate(
      { reviewId, payload },
      {
        onSuccess: () => {
          toast.success("Review updated successfully!");
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError, "Failed to update review."));
        },
      },
    );
  }

  function handleDeleteReview(reviewId: string) {
    deleteReviewMutation.mutate(reviewId, {
      onSuccess: () => {
        toast.success("Review deleted successfully!");
      },
      onError: (mutationError) => {
        toast.error(getErrorMessage(mutationError, "Failed to delete review."));
      },
    });
  }

  return (
    <section id="reviews" className="mt-10 scroll-mt-24 space-y-6">
      <div className="border-t border-cream-dark pt-8">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          Customer Reviews
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/70 sm:text-base">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Average Rating</span>
            <StarRating rating={Math.round(averageRating)} size="sm" />
            <span className="font-semibold text-foreground">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span>
            {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {isLoadingReviews ? (
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
      ) : (
        <>
          {reviews.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <p className="text-foreground/70">No reviews yet.</p>
              <p className="mt-1 text-sm text-foreground/50">
                Be the first to review this product.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwn={review.user.id === currentUser?.id}
                  onUpdate={handleUpdateReview}
                  onDelete={handleDeleteReview}
                  isUpdating={
                    updateReviewMutation.isPending &&
                    updateReviewMutation.variables?.reviewId === review.id
                  }
                  isDeleting={
                    deleteReviewMutation.isPending &&
                    deleteReviewMutation.variables === review.id
                  }
                />
              ))}
            </div>
          )}

          {!isLoggedIn && (
            <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <p className="text-foreground/70">Log in to write a review.</p>
              <Link
                href="/login"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark"
              >
                Log in
              </Link>
            </div>
          )}

          {isLoggedIn && !hasPurchased && (
            <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <p className="text-foreground/70">
                Purchase this product to leave a review.
              </p>
            </div>
          )}

          {canCreateReview && (
            <form
              onSubmit={handleCreateReview}
              className="rounded-2xl bg-white p-6 shadow-md sm:p-8"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Write a Review
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground/80">
                    Your rating
                  </p>
                  <StarRatingInput
                    value={rating}
                    onChange={setRating}
                    disabled={createReviewMutation.isPending}
                  />
                </div>
                <div>
                  <label
                    htmlFor="review-text"
                    className="mb-1.5 block text-sm font-medium text-foreground/80"
                  >
                    Your review
                  </label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    rows={4}
                    disabled={createReviewMutation.isPending}
                    className={`${inputClassName} min-h-28 resize-y`}
                    placeholder="Share your experience with this dish..."
                  />
                </div>
                {validationError && (
                  <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
                    {validationError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="min-h-11 w-full rounded-full bg-tomato px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60 sm:w-auto"
                >
                  {createReviewMutation.isPending
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
