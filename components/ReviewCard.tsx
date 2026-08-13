"use client";

import { useEffect, useRef, useState } from "react";
import ReviewAvatar from "@/components/ReviewAvatar";
import StarRating from "@/components/StarRating";
import StarRatingInput from "@/components/StarRatingInput";
import type { Review } from "@/types";

const inputClassName =
  "w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none";

function formatReviewDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ReviewCardProps {
  review: Review;
  isOwn?: boolean;
  onUpdate?: (
    reviewId: string,
    payload: { review: string; rating: number },
  ) => void;
  onDelete?: (reviewId: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function ReviewCard({
  review,
  isOwn = false,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editText, setEditText] = useState(review.review);
  const [validationError, setValidationError] = useState("");
  const previousReviewRef = useRef(review);

  useEffect(() => {
    const previousReview = previousReviewRef.current;
    const reviewChanged =
      previousReview.review !== review.review ||
      previousReview.rating !== review.rating;

    if (reviewChanged) {
      setIsEditing(false);
      setConfirmDelete(false);
      setEditRating(review.rating);
      setEditText(review.review);
      setValidationError("");
    }

    previousReviewRef.current = review;
  }, [review]);

  function handleCancelEdit() {
    setEditRating(review.rating);
    setEditText(review.review);
    setValidationError("");
    setIsEditing(false);
  }

  function handleSaveEdit() {
    const trimmedReview = editText.trim();

    if (!trimmedReview) {
      setValidationError("Review text cannot be empty.");
      return;
    }

    if (editRating < 1 || editRating > 5) {
      setValidationError("Rating must be between 1 and 5.");
      return;
    }

    setValidationError("");
    onUpdate?.(review.id, { review: trimmedReview, rating: editRating });
  }

  return (
    <article className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <ReviewAvatar user={review.user} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {isOwn && (
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-basil">
                  Your Review
                </p>
              )}
              <p className="truncate font-semibold text-foreground">
                {review.user.name}
              </p>
            </div>
            {!isEditing && <StarRating rating={review.rating} size="sm" />}
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-4">
              <StarRatingInput
                value={editRating}
                onChange={setEditRating}
                disabled={isUpdating}
              />
              <textarea
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                rows={4}
                disabled={isUpdating}
                className={`${inputClassName} min-h-28 resize-y`}
              />
              {validationError && (
                <p className="rounded-lg bg-tomato/10 px-4 py-2 text-sm text-tomato">
                  {validationError}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="min-h-11 rounded-full border border-cream-dark px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-cream disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="min-h-11 rounded-full bg-tomato px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-3 break-words text-sm leading-relaxed text-foreground/80 sm:text-base">
                {review.review}
              </p>
              <p className="mt-3 text-xs text-foreground/50 sm:text-sm">
                {formatReviewDate(review.createdAt)}
              </p>
            </>
          )}

          {isOwn && !isEditing && (
            <div className="mt-4 flex flex-wrap gap-3">
              {confirmDelete ? (
                <div className="w-full rounded-xl border border-tomato/20 bg-tomato/5 p-4">
                  <p className="text-sm text-foreground/80">
                    Delete this review permanently?
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                      className="min-h-11 rounded-full border border-cream-dark px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-cream disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(review.id)}
                      disabled={isDeleting}
                      className="min-h-11 rounded-full bg-tomato px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-tomato-dark disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={isDeleting}
                    className="min-h-11 rounded-full border border-basil/30 px-5 py-2.5 text-sm font-semibold text-basil transition-colors hover:bg-basil/5 disabled:opacity-60"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={isDeleting}
                    className="min-h-11 rounded-full border border-tomato/30 px-5 py-2.5 text-sm font-semibold text-tomato transition-colors hover:bg-tomato/5 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
