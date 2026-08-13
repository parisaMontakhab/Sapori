"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getProductById,
  getProducts,
  getProductsPaginated,
  type ProductsQueryParams,
} from "@/services/productService";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: getProducts,
  });
}

export function useProductsPaginated(params: ProductsQueryParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 6;
  const search = params.search?.trim() || undefined;
  const category = params.category?.trim() || undefined;

  return useQuery({
    queryKey: queryKeys.products.list({ page, limit, search, category }),
    queryFn: () =>
      getProductsPaginated({
        page,
        limit,
        search,
        category,
      }),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ""),
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
}
