import { apiFetch } from "@/lib/api";
import { mapReview, type BackendReview } from "@/lib/mappers";
import type { Review, ReviewPayload } from "@/types";

interface ReviewsListResponse {
  status: string;
  results: number;
  data: {
    reviews: BackendReview[];
  };
}

function mapReviewsList(
  response: ReviewsListResponse,
  productId?: string,
): Review[] {
  const rawReviews = response.data?.reviews;

  if (!rawReviews || !Array.isArray(rawReviews)) {
    return [];
  }

  return rawReviews
    .map((review) => mapReview(review, productId))
    .filter((review): review is Review => review !== null);
}

interface ReviewResponse {
  status: string;
  data: {
    data: BackendReview;
  };
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const response = await apiFetch<ReviewsListResponse>(
    `/products/${productId}/reviews`,
  );

  return mapReviewsList(response, productId);
}

export async function getAllReviews(): Promise<Review[]> {
  const response = await apiFetch<ReviewsListResponse>("/reviews");

  return mapReviewsList(response);
}

export async function createReview(
  productId: string,
  payload: ReviewPayload,
): Promise<Review> {
  const response = await apiFetch<ReviewResponse>(
    `/products/${productId}/reviews`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const review = mapReview(response.data.data, productId);

  if (!review) {
    throw new Error("Invalid review response from server.");
  }

  return review;
}

export async function updateReview(
  productId: string,
  reviewId: string,
  payload: ReviewPayload,
): Promise<Review> {
  const response = await apiFetch<ReviewResponse>(
    `/products/${productId}/reviews/${reviewId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  const review = mapReview(response.data.data, productId);

  if (!review) {
    throw new Error("Invalid review response from server.");
  }

  return review;
}

export async function deleteReview(
  productId: string,
  reviewId: string,
): Promise<void> {
  await apiFetch<void>(`/products/${productId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
