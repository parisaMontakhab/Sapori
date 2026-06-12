import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getProducts } from "@/services/productService";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const allProducts = await getProducts();

  const products = search
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    : allProducts;

  const categories = [...new Set(allProducts.map((p) => p.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Our Menu</h1>
        <p className="mt-2 text-foreground/60">
          Explore {allProducts.length} dishes across {categories.length}{" "}
          categories — pizza, pasta, antipasti & more.
        </p>
        <div className="mt-6">
          <SearchBar defaultValue={search ?? ""} />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-basil shadow-sm"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Results */}
      {search && (
        <p className="text-sm text-foreground/60">
          {products.length} result{products.length !== 1 ? "s" : ""}
          {" for "}
          &ldquo;{search}&rdquo;
        </p>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-md">
          <p className="text-4xl">🍽️</p>
          <p className="mt-4 text-lg font-medium">No dishes found</p>
          <p className="mt-1 text-foreground/60">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
