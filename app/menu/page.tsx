import { Suspense } from "react";
import MenuPageContent from "@/components/MenuPageContent";
import { getProducts } from "@/services/productService";

export default async function MenuPage() {
  const allProducts = await getProducts();
  const categories = [...new Set(allProducts.map((product) => product.category))];

  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Our Menu
            </h1>
            <p className="mt-2 text-sm text-foreground/60">Loading menu...</p>
          </div>
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
