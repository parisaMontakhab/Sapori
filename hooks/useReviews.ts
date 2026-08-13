"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryKeys } from "@/lib/queryKeys";
import {
  createReview,
  deleteReview,
  getProductReviews,
  updateReview,
} from "@/services/reviewService";
import type { ReviewPayload } from "@/types";

export function invalidateReviewRelatedQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: string,
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.reviews.product(productId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.products.detail(productId),
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.product(productId),
    queryFn: () => getProductReviews(productId),
  });
}

export function useReviewedProductIds(
  productIds: string[],
  userId: string | undefined,
) {
  const uniqueProductIds = useMemo(
    () => [...new Set(productIds)],
    [productIds],
  );

  const queries = useQueries({
    queries: uniqueProductIds.map((productId) => ({
      queryKey: queryKeys.reviews.product(productId),
      queryFn: () => getProductReviews(productId),
      enabled: Boolean(userId) && uniqueProductIds.length > 0,
    })),
  });

  return useMemo(() => {
    const reviewed = new Set<string>();

    if (!userId) {
      return reviewed;
    }

    uniqueProductIds.forEach((productId, index) => {
      const reviews = queries[index]?.data;

      if (reviews?.some((review) => review.user.id === userId)) {
        reviewed.add(productId);
      }
    });

    return reviewed;
  }, [queries, uniqueProductIds, userId]);
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => createReview(productId, payload),
    onSuccess: () => {
      invalidateReviewRelatedQueries(queryClient, productId);
    },
  });
}

export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: ReviewPayload;
    }) => updateReview(productId, reviewId, payload),
    onSuccess: () => {
      invalidateReviewRelatedQueries(queryClient, productId);
    },
  });
}

export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(productId, reviewId),
    onSuccess: () => {
      invalidateReviewRelatedQueries(queryClient, productId);
    },
  });
}
