import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function MenuPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Menu</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="rounded border bg-white p-4 hover:border-red-300"
          >
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-zinc-500">{product.description}</p>
            <p className="mt-2 font-bold">€{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
