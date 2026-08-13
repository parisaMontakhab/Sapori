"use client";

import Link from "next/link";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const reviewCount = product.ratingsQuantity ?? 0;
  const hasReviews = reviewCount > 0;
  const averageRating = product.ratingsAverage ?? 0;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
      <Link
        href={`/product/${product.id}`}
        className="block overflow-hidden rounded-t-2xl"
      >
        <ProductImage product={product} />
      </Link>

      <div className="p-5">
        <span className="mb-2 inline-block rounded-full bg-basil/10 px-3 py-1 text-xs font-semibold text-basil">
          {product.category}
        </span>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-foreground hover:text-tomato">
            {product.name}
          </h3>
        </Link>

        {hasReviews ? (
          <p
            className="mt-1 flex items-center gap-1 text-sm text-foreground/70"
            aria-label={`${averageRating.toFixed(1)} out of 5 stars, ${reviewCount} reviews`}
          >
            <span className="text-orange" aria-hidden>
              ★
            </span>
            <span className="font-medium text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-foreground/50">({reviewCount})</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-foreground/50">No reviews yet</p>
        )}

        <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
          {product.description}
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-bold text-tomato">€{product.price}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
