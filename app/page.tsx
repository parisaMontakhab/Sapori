import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-red-700">Sapori</h1>
      <p className="mb-8 text-zinc-600">
        Italian food delivery. Browse our menu and order your favorites.
      </p>

      <h2 className="mb-4 text-xl font-bold">Popular Dishes</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {featured.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="rounded border bg-white p-4 hover:border-red-300"
          >
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-zinc-500">{product.category}</p>
            <p className="mt-2 font-bold">€{product.price}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/menu"
        className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
      >
        View Full Menu
      </Link>
    </div>
  );
}
