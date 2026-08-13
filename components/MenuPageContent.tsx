"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MenuPagination from "@/components/MenuPagination";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useProductsPaginated } from "@/hooks/useProducts";
import { MENU_PAGE_SIZE } from "@/services/productService";

interface MenuPageContentProps {
  categories: string[];
  catalogProductCount: number;
}

function buildMenuUrl({
  page,
  search,
  category,
}: {
  page: number;
  search?: string;
  category?: string;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/menu?${query}` : "/menu";
}

export default function MenuPageContent({
  categories,
  catalogProductCount,
}: MenuPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim() || undefined;
  const category = searchParams.get("category")?.trim() || undefined;
  const requestedPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data, isPending } = useProductsPaginated({
    page: requestedPage,
    limit: MENU_PAGE_SIZE,
    search,
    category,
  });

  const totalPages = data?.totalPages ?? 0;
  const page =
    totalPages > 0
      ? Math.min(requestedPage, totalPages)
      : requestedPage;
  const products = data?.products ?? [];
  const totalProducts = data?.totalProducts ?? 0;

  useEffect(() => {
    if (!data || totalPages === 0) return;

    if (requestedPage > totalPages) {
      router.replace(buildMenuUrl({ page: totalPages, search, category }));
    }
  }, [category, data, requestedPage, router, search, totalPages]);

  function handlePageChange(nextPage: number) {
    const clampedPage = Math.min(
      Math.max(nextPage, 1),
      Math.max(totalPages, 1),
    );

    router.push(buildMenuUrl({ page: clampedPage, search, category }));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Our Menu
        </h1>
        <p className="mt-2 text-foreground/60">
          Explore {catalogProductCount} dishes across {categories.length}{" "}
          categories — pizza, pasta, antipasti & more.
        </p>
        <div className="mt-6">
          <SearchBar defaultValue={search ?? ""} category={category} />
        </div>
      </div>

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

      {search && (
        <p className="text-sm text-foreground/60">
          {totalProducts} result{totalProducts !== 1 ? "s" : ""}
          {" for "}
          &ldquo;{search}&rdquo;
        </p>
      )}

      {isPending ? null : products.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-md">
          <p className="text-4xl">🍽️</p>
          <p className="mt-4 text-lg font-medium">No dishes found</p>
          <p className="mt-1 text-foreground/60">Try a different search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <MenuPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
