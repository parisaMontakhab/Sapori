import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
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
      <Link href="/menu" className="mb-4 inline-block text-sm text-red-700">
        ← Back to Menu
      </Link>

      <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
      <p className="mb-2 text-sm text-zinc-500">{product.category}</p>
      <p className="mb-4">{product.description}</p>
      <p className="mb-6 text-xl font-bold">€{product.price}</p>

      <AddToCartButton product={product} />
    </div>
  );
}
