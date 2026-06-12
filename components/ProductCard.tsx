"use client";

import Link from "next/link";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
      <Link href={`/product/${product.id}`} className="block">
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

        <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-tomato">€{product.price}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
