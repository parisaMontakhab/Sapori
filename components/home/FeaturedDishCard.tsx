"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/types";
import { FALLBACK_IMAGE, PRODUCT_IMAGES } from "./foodImages";

export default function FeaturedDishCard({ product }: { product: Product }) {
  const imageUrl = PRODUCT_IMAGES[product.id] ?? FALLBACK_IMAGE;

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-basil shadow-sm backdrop-blur-sm">
          {product.category}
        </span>
      </Link>

      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-foreground group-hover:text-tomato">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/60">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-2xl font-bold text-tomato">€{product.price}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
