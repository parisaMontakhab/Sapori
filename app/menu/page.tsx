import MenuPageContent from "@/components/MenuPageContent";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { getProducts } from "@/services/productService";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const allProducts = await getProducts();
  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ];

  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Our Menu
            </h1>
            <p className="mt-2 h-5 w-full max-w-xl animate-pulse rounded bg-cream-dark" />
            <div className="mt-6 h-11 w-full max-w-xl animate-pulse rounded-full bg-cream-dark" />
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      }
    >
      <MenuPageContent
        categories={categories}
        catalogProductCount={allProducts.length}
      />
    </Suspense>
  );
}
