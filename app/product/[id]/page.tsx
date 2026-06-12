import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";
import { getProductById } from "@/services/productService";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-tomato hover:underline"
      >
        ← Back to Menu
      </Link>

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <ProductImage product={product} large />

        <div className="p-6 sm:p-10">
          <span className="inline-block rounded-full bg-basil/10 px-4 py-1.5 text-sm font-semibold text-basil">
            {product.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground/70">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-cream-dark pt-8">
            <span className="text-3xl font-bold text-tomato">
              €{product.price}
            </span>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
