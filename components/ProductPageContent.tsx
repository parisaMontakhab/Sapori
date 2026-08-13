"use client";

import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import ProductImage from "@/components/ProductImage";
import ProductNotFound from "@/components/ProductNotFound";
import QueryErrorState from "@/components/QueryErrorState";
import { useProduct } from "@/hooks/useProducts";
import { getErrorMessage } from "@/lib/errors";

export default function ProductPageContent({
  productId,
}: {
  productId: string;
}) {
  const {
    data: product,
    isPending,
    isFetching,
    isError,
    error,
    isSuccess,
    refetch,
    isRefetching,
  } = useProduct(productId);

  const isLoading = isPending || isFetching;

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return (
      <QueryErrorState
        title="Unable to load product"
        message={getErrorMessage(
          error,
          "Something went wrong while loading this product.",
        )}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (isSuccess && !product) {
    return <ProductNotFound />;
  }

  if (!product) {
    return null;
  }

  return (
    <div>
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-tomato hover:underline"
      >
        ← Back to Menu
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
        <ProductImage product={product} large />

        <div className="p-5 sm:p-8 md:p-10">
          <span className="inline-block rounded-full bg-basil/10 px-4 py-1.5 text-sm font-semibold text-basil">
            {product.category}
          </span>

          <h1 className="mt-3 text-2xl font-bold text-foreground sm:mt-4 sm:text-3xl md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70 sm:mt-4 sm:text-lg">
            {product.description}
          </p>

          <div className="mt-6 flex flex-col gap-4 border-t border-cream-dark pt-6 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:pt-8">
            <span className="text-2xl font-bold text-tomato sm:text-3xl">
              €{product.price}
            </span>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
