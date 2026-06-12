import Image from "next/image";
import type { Product } from "@/types";

export default function ProductImage({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${
        large ? "h-72 sm:h-96" : "h-[220px]"
      }`}
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes={
          large
            ? "(max-width: 768px) 100vw, 768px"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className={
          product.category === "Drinks"
            ? "object-cover object-center"
            : "object-cover"
        }
      />
    </div>
  );
}
